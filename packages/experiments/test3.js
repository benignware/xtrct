const Perceptron = require('./perceptron');
// const { djb2, HashTable } = require('./hash');
const FeatureEncoder = require('./FeatureEncoder');

// slim=0/fat=1
let data = [
  [{ height: 'normal', width: 'normal' }, 'fat'],
  [{ height: 'small', width: 'big' }, 'fat'],
  [{ height: 'normal', width: 'big' }, 'fat'],
  // [{ height: 'normal', width: 'thin' }, 'slim'],
  [{ height: 'small', width: 'normal' }, 'fat'],
  [{ height: 'small', width: 'thin' }, 'slim'],
  [{ height: 'tall', width: 'thin' }, 'slim']
];

// const vectorize = (instance, options = {}) => {
//   options = {
//     hash: djb2,
//     ...options
//   };
//   // Sort keys
//   const keys = [ ...Object.keys(instance) ].slice().sort();
//   const result = [];
//
//   let value;
//   for (let key of keys) {
//     value = parseFloat(instance[key]);
//
//     if (isNaN(value)) {
//       value = options.hash(instance[key]);
//     }
//
//     result.push(value);
//   }
//
//   return result;
// };


// AND
const p = new Perceptron();
const inputEncoder = new FeatureEncoder({
  hash: true
});
const outputEncoder = new FeatureEncoder();

// const data = [{
//   height: 'tall',
//   width: 0.173
// }, {
//   height: 'small',
//   width: 0.273
// }]

// const instances = data.map(([ instance ]) => instance);
// const encoded = labelEncoder.encode(instances);
// data = data.map(([, expected ], index) => ([
//   encoded[index], expected
// ]));
//
// console.log('data', data);

// const t = outputEncoder.encode('test');
// console.log('t: ', t);
// process.exit();

for (let [ features, output ] of data) {
  features = inputEncoder.encode(features);
  output = outputEncoder.encode(output).shift();
  console.log('train...', features, output);
  p.train(features, output);
}

const count = p.learn();
console.log(`learned after ${count} iterations `);
const actual = outputEncoder.decode(p.predict(inputEncoder.encode({
  width: 'thin',
  height: 'normal'
})));

console.log('actual', actual);
