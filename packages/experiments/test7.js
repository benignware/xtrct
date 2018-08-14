const fs = require('fs');
const Papa = require('papaparse');

const Perceptron = require('./perceptron');
const FeatureEncoder = require('./FeatureEncoder');
const { default: normalize } = require('./normalization');
const { min, max, mean, deviation, zip, transpose, sigmoid } = require('./math');

const file = './test/fixtures/Salary_Data.csv';
const source = fs.readFileSync(file, 'utf-8');

// Parse local CSV file
let { data } = Papa.parse(source, {
  header: true,
  dynamicTyping: true
});

// Last item is broken
data.pop();

// data = transpose(data);



const p = new Perceptron({
  activate: sigmoid
});

const m = Math.ceil(0.8 * data.length);
const trainingSet = data.slice(0, m);
const testSet = data.slice(m);

for (let { Salary: expected, ...inputs } of trainingSet) {
  p.train(Object.values(inputs), expected);
}

p.learn(10000);

for (let { Salary: expected, ...inputs } of testSet) {
  const result = p.predict(Object.values(inputs));
  console.log('PREDICT: ', result, expected);
}
