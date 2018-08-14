const fs = require('fs');
const Papa = require('papaparse');

const Perceptron = require('./perceptron');
const DataTable = require('./datatable');
const { default: normalize } = require('./normalization');
const Math = require('./math');

const file = './test/fixtures/winequality-red.csv';
const source = fs.readFileSync(file, 'utf-8');

// Parse local CSV file
let { data } = Papa.parse(source, {
  header: true,
  dynamicTyping: true
});

let dataTable = DataTable.fromJson(data);

dataTable = dataTable.normalize();

data = dataTable.toJson();

const trainingSet = data.slice(0, parseInt(data.length/2));
const testSet = data.slice(parseInt(data.length/2));

const p = new Perceptron({
  activate: Math.sigmoid
});

for (let { quality: expected, ...inputs } of trainingSet) {
  // console.log('train...', Object.values(inputs), expected);
  p.train(Object.values(inputs), expected);
}

//
// const m = Math.ceil(0.8 * data.length);
// const trainingSet = data.slice(0, m);
// const testSet = data.slice(m);
//
// for (let { Salary: expected, ...inputs } of trainingSet) {
//   p.train(Object.values(inputs), expected);
// }
//
p.learn(10000);
// //

let pass = 0;
let fail = 0;
for (let { quality: expected, ...inputs } of testSet) {
  if (Object.values(inputs).some(value => value === null)) {
    // console.log('null: ', Object.values(inputs));
  } else {
    // console.log('pass');
    const result = p.predict(Object.values(inputs));
    console.log('PREDICT: ', Object.values(inputs), expected, 'RESULT: ', result);
    if (expected > 0 && result) {
      console.log('ok', expected, result);
      pass++;
    } else {
      console.log('fail...', expected, result);
      fail++;
    }
  }

  //
}

console.log('pass...', pass, fail);
