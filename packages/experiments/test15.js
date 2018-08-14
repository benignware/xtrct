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
  './test/fixtures/names/white_male_names.csv',
  './test/fixtures/names/white_female_names.csv',
  './test/fixtures/names/hispanic_male_names.csv',
  './test/fixtures/names/hispanic_female_names.csv',
  './test/fixtures/names/black_male_names.csv',
  './test/fixtures/names/black_female_names.csv',
];

let data = source.reduce((result, src) => ([
  ...result,
  ...Papa.parse(fs.readFileSync(src, 'utf-8'), csvOptions).data
]), []);

data = data.map((entry) => camelizeKeys(entry));

data = data.map(({ firstName = '', ...entry }) => ({
  ...entry,
  firstName: firstName.trim().replace(/\s+.*$/, '').replace(/\/.*$/, '')
}));

let males = data.filter(({ gender }) => gender === 'm');
let females = data.filter(({ gender }) => gender === 'f');

let size = Math.min(males.length, females.length);

console.log('males...', males.length, ' females...', females.length, 'size: ', size);

males = males.slice(0, size);
females = females.slice(0, size);

data = [ ...males, ...females ];

data = shuffleArray(data);

data = distinctByProp(data, 'firstName');

data = data.filter(entry => entry.firstName.length >= 3);

console.log('data size', data.length);

const transposed = transpose(data);

const inputEncoder = new AsciiEncoder(transposed.firstName, {
  length: INPUT_LENGTH,
  suffix: true,
  caseSensitive: false
});

const outputEncoder = new OneHotEncoder(transposed.gender);

const extract = data => data.map(({ firstName, gender }, index) => {
  return ({
    input: inputEncoder.encode(firstName),
    output: outputEncoder.encode(gender)
  });
});

console.log('input...', inputEncoder.size);
console.log('output...', outputEncoder.size);

// data = data.slice(0, 200);

let trainingData = extract(data.slice(0, parseInt(data.length * 0.97)));
let testData = data.slice(parseInt(data.length * 0.97));

const myNetwork = new synaptic.Architect.Perceptron(inputEncoder.size, 6, outputEncoder.size);
const trainer = new synaptic.Trainer(myNetwork);
//
const iterations = 200;

for(var i = 0 ; i < 25 ; i++) {
  trainer.train(trainingData, {
    rate: 0.01,
    iterations,
    shuffle: true,
    cost: synaptic.Trainer.cost.MSE
  });
  var error = trainer.test(trainingData)["error"];
  console.log(
     "Iteration " + ((i + 1) * iterations) + " --> Error: " + error
  );
}

const predict = (firstName) => {
  const string = inputEncoder.encode(firstName);
  const result = myNetwork.activate(string);

  const decoded = outputEncoder.decode(result);

  // console.log('decode...', result, decoded);

  return decoded;
};

testData.push(...[
  { firstName: 'Julian', gender: 'm' },
  { firstName: 'Lina', gender: 'f' },
  { firstName: 'Jessica', gender: 'f' },
  { firstName: 'Rafael', gender: 'm' },
  { firstName: 'Juliane', gender: 'f' },
  { firstName: 'Linus', gender: 'm' },
  { firstName: 'Rafaela', gender: 'f' },
  { firstName: 'Jesus', gender: 'm' },
  { firstName: 'Zoe', gender: 'f' },
  { firstName: 'Paula', gender: 'f' },
  { firstName: 'Claudia', gender: 'f' },
  { firstName: 'Lasse', gender: 'm' },
  { firstName: 'Matthis', gender: 'm' },
  { firstName: 'Rosi', gender: 'f' }
])

const results = testData.map(({ firstName, gender }, index) => {
  const result = predict(firstName);
  console.log(`Predict gender of ${firstName} (${gender}) -> ${result} - ${result === gender ? 'pass' : 'fail'}`);
  return result === gender;
});

console.log('results accuracy: ', results.filter(res => res).length / results.length * 100 + '%');
//
// console.log('Juliane -> ', predict('Juliane'));
// console.log('Linus -> ', predict('Linus'));
// console.log('Rafael -> ', predict('Rafael'));
// console.log('Jessica -> ', predict('Jessica'));
// console.log('Brigitte -> ', predict('Brigitte'));
// console.log('Zoe -> ', predict('Zoe'));
