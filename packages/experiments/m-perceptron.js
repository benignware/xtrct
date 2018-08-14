class Perceptron {
  constructor(options) {
    this.options = {
      bias: 1,
      learningRate: 0.1,
      maxIterations: 10000,
      ...options
    };
    this.weights = [];
    this.trainingSet = [];
  }

  init(inputs) {
    // Initialize weights to 0 and adding bias weight
    this.weights = [ ...inputs.map(i => Math.random()), this.options.bias ];
  }

  train(inputs, expected) {
    if (!this.weights.length) {
      this.init(inputs);
    }

    if (inputs.length != this.weights.length) {
      inputs.push(1); // Adding the bias
    }

    // Keeping this in the training set if it didn't exist
    if (!this.trainingSet.find(t => t.inputs.every((inp, i) => inp === inputs[i]))) {
      this.trainingSet.push({ inputs, expected });
    }

    const actual = this.evaluate(inputs);
    if (actual == expected) {
      return true; // Correct weights return and don't touch anything.
    }

    // Otherwise update each weight by adding the error * learningRate relative to the input
    this.weights = this.weights.map((w, i) => w += this.delta(actual, expected, inputs[i]));
    return this.weights;
  }

  // Calculates the difference between actual and expected for a given input
  delta(actual, expected, input) {
    const error = expected - actual; // How far off were we
    return error * this.options.learningRate * input;
  }

  // Iterates until the weights are correctly set
  learn() {
    let success = false;
    let count = 0;
    while (!success) {
      success = this.trainingSet.every(t => this.train(t.inputs, t.expected) === true);
      count++;
      if (count >= this.options.maxIterations) {
        break;
      }
    }
    return count;
  }

  // Sum inputs * weights
  weightedSum(inputs = this.inputs, weights = this.weights) {
    return inputs.map((inp, i) => inp * weights[i]).reduce((x, y) => x + y, 0);
  }

  // Evaluate using the current weights
  evaluate(inputs) {
    return this.activate(this.weightedSum(inputs));
  }

  // Sugar syntax evaluate with added bias input
  predict(inputs) {
    return this.evaluate([ ...inputs, 1 ]);
  }

  // Heaviside as the activation function
  activate(value) {
    return value >= 0 ? 1 : 0;
  }

}

module.exports = Perceptron;
