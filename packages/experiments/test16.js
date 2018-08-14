const fs = require('fs');
const Papa = require('papaparse');
const { camelizeKeys } = require('humps');
const synaptic = require('synaptic');

const transpose = data => {
  return Object.entries(data).reduce((result, [ key, cells ], y) => ({
    ...result,
    ...Object.entries(data[y]).reduce((result, [ key, cell ], x) => ({
      ...result,
      [key]: [ ...(result[key] || []), cell ]
    }), result)
  }), {});
}

const Math = require('./math');
const AsciiEncoder = require('./features/AsciiEncoder');
const OneHotEncoder = require('./features/OneHotEncoder');
const NumberEncoder = require('./features/NumberEncoder');

// fully random by @BetonMAN
const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

const distinctByProp = (theArray, prop) => {
  let tempArray = [];
  let isFound = obj => tempArray.find( n => n[prop] === obj[prop]);
  theArray.forEach( current => !isFound(current) && tempArray.push(current));
  return tempArray;
}

const INPUT_LENGTH = 8;


const csvOptions = {
  header: true,
  dynamicTyping: true
};

let source = [
  './test/fixtures/wine/winequality-red.csv',
];

let data = source.reduce((result, src) => ([
  ...result,
  ...Papa.parse(fs.readFileSync(src, 'utf-8'), csvOptions).data
]), []);

data = data.map((entry) => camelizeKeys(entry));

// data = data.slice(0, 400);
data = data.filter(entry => {
  return Object.values(entry).every(value => !isNaN(parseFloat(value)));
});

data = data.map(({ quality, ...entry }) => ({
  ...entry,
  quality: quality < 5 ? 'poor' : quality > 6 ? 'good' : 'average'
}));

data = shuffleArray(data);

const { quality, ...features } = transpose(data);

const inputEncoders = Object.assign(
  {}, ...Object.entries(features).map(([ key, sample ]) => ({
    [key]: new NumberEncoder(sample)
  }))
);

const qualityEncoder = new OneHotEncoder(quality);

const encodeInputs = (entry) => {
  return Object.entries(entry).reduce((result, [ key, value ]) => ([
    ...result,
    ...inputEncoders[key].encode(value)
  ]), []);
}

const extract = data => data.map(({ quality, ...entry }, index) => {
  const inputs = encodeInputs(entry);
  const res = ({
    input: inputs,
    output: qualityEncoder.encode(quality)
  });

  // console.log('encode...', inputs);
  return res;
});

let trainingData = extract(data.slice(0, parseInt(data.length)));
let testData = shuffleArray(data).slice(0, 100);

console.log('trainingData: ', trainingData.length);

const inputSize = Object.keys(inputEncoders).length;
const outputSize = qualityEncoder.size;

console.log('size: ', inputSize, outputSize);

const myNetwork = new synaptic.Architect.Perceptron(inputSize, 6, outputSize);
const trainer = new synaptic.Trainer(myNetwork);
//
const iterations = 300;

for(var i = 0 ; i < 80 ; i++) {
  trainer.train(trainingData, {
    rate: 0.01,
    iterations,
    shuffle: true,
    cost: synaptic.Trainer.cost.CROSS_ENTROPY
  });
  const { error, ...rest } = trainer.test(trainingData);
  // console.log('rest...', rest);
  console.log(
     "Iteration " + ((i + 1) * iterations) + " --> Error: " + error
  );
}

const predict = (entry) => {
  const inputs = encodeInputs(entry);

  const result = myNetwork.activate(inputs);

  const decoded = qualityEncoder.decode(result);

  return decoded;
};

const results = testData.map(({ quality, ...entry }, index) => {
  const result = predict(entry);
  console.log('PREDICT: ', Object.values(entry), quality, result);
  return result === quality;
});

console.log('results accuracy: ', results.filter(res => res).length / results.length * 100 + '%');


// console.log('to json...', myNetwork.toJSON());
