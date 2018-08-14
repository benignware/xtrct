const fs = require('fs');
const Papa = require('papaparse');

const Perceptron = require('./perceptron');
const FeatureEncoder = require('./FeatureEncoder');
const { default: normalize, transpose } = require('./normalization');
const { min, max, mean, deviation } = require('./math');

const perceptron = new Perceptron({
  // activate: value => value
});


const file = './test/fixtures/winequality-red.csv';
const source = fs.readFileSync(file, 'utf-8');

// Parse local CSV file
let { data } = Papa.parse(source, {
  header: true,
  dynamicTyping: true
});

data = data.slice(0, 1000);

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

const extract = data => Object.assign(
  {},
  ...Object.entries(transpose(data)).map(([ name, sample ]) => ({
    [name]: Object.assign({
      name,
      type: 'number',
    },
    ...[ min, max, mean, deviation ].map(fn => ({
      [fn.name]: fn(...sample)
    })))
  }))
);


const clean = data => {
  return data.map(row => Object.assign({}, ...Object.entries(row).map(([ name, value ]) => {
    console.log('...', value);
    return ({
      [name]: isNaN(value) ? 0 : 1
    });
  })))
};

data = data.slice(0, 500);
// data = clean(data);

const features = extract(data);

const normal = entry => Object.assign({}, ...Object.entries(entry).map(([ key, value ]) => {
  const { min, max, mean } = features[key];
  return ({
    [key]: (value - mean) / (max - min)
  });
}));

const isGoodWine = quality => quality > 4 ? 1 : 0;

const m = parseInt(0.8 * data.length);
let trainingData = data.slice(0, m);
let testData = data.slice(m);

const trained = trainingData.map(({ quality, ...entry }, index) => {
  const values = Object.values(normal(entry));
  const expected = isGoodWine(quality);
  console.log('train...', index, 'expect: ', quality, expected);
  return perceptron.train(values, expected);
});

// console.log('trained', trained);

const c = perceptron.learn();

testData = trainingData;

const r = testData.map(({ quality, ...entry }, index) => {
  const values = Object.values(normal(entry));
  const expected = isGoodWine(quality);
  const result = perceptron.predict(values);
  console.log('predict...', index, 'result: ', result, '~', expected);
  return result;
});

// console.log('result...', r);
