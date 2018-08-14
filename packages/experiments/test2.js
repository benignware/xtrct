const Perceptron = require('./perceptron');

// AND
const p = new Perceptron();

p.train([1, 1], 1);
p.train([0, 1], 0);
p.train([1, 0], 0);
p.train([0, 0], 0);

const count = p.learn();

console.log('trained after ' + count + ' iterations');

const actuals = [
  p.predict([1, 1]), // => 1
  p.predict([0, 1]), // => 0
  p.predict([1, 0]), // => 0
  p.predict([0, 0]) // => 0
];

const score = p.evaluate([1, 0]);
console.log('actuals: ', score);
