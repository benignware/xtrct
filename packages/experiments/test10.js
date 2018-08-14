const fs = require('fs');
const Papa = require('papaparse');

const Perceptron = require('./perceptron');
const DataTable = require('./datatable');
const { default: normalize } = require('./normalization');
const Math = require('./math');

const file = './test/fixtures/Salary_Data.csv';
const source = fs.readFileSync(file, 'utf-8');

// Parse local CSV file
let { data } = Papa.parse(source, {
  header: true,
  dynamicTyping: true
});

const dataTable = DataTable.fromJson(data).normalize();
const trainingSet = dataTable.toJson().slice(0, parseInt(dataTable.size/2));
const testSet = dataTable.toJson().slice(parseInt(dataTable.size/2));

const p = new Perceptron({
  activate: Math.sigmoid
});

for (let { Salary: expected, ...inputs } of trainingSet) {
  console.log('train...', inputs, expected);
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
//
for (let { Salary: expected, ...inputs } of testSet) {
  const result = p.predict(Object.values(inputs));
  console.log('PREDICT: ', Object.values(inputs), expected, 'RESULT: ', result);
}
