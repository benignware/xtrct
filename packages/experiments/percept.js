// const { sigmoid } = require('./math')
//
// class Perceptron {
//   constructor(options = {}) {
//     this.options = {
//       learningRate: 0.1,
//       iterations: 50,
//       hiddenUnits: 3,
//       activate: sigmoid,
//       ...options
//     };
//     this.weights = [];
//   }
//
//   forward(examples) {
//     const { activate } = this.options;
//     const weights = this.weights;
//     const ret = {};
//
//     ret.hiddenSum = multiply(weights.inputHidden, examples.input);
//     ret.hiddenResult = ret.hiddenSum.transform(activate);
//     ret.outputSum = multiply(weights.hiddenOutput, ret.hiddenResult);
//     ret.outputResult = ret.outputSum.transform(activate);
//
//     return ret;
//   }
// }
// function Mind(opts) {
//   if (!(this instanceof Mind)) return new Mind(opts);
//   opts = opts || {};
//
//   opts.activator === 'sigmoid'
//     ? (this.activate = sigmoid, this.activatePrime = sigmoidPrime)
//     : (this.activate = htan, this.activatePrime = htanPrime);
//
//   // hyperparameters
//   this.learningRate = opts.learningRate || 0.7;
//   this.iterations = opts.iterations || 10000;
//   this.hiddenUnits = opts.hiddenUnits || 3;
// }
