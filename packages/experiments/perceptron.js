class Perceptron {
  constructor(options) {
    this.options = {
      bias: 1,
      learningRate: 0.01,
      iterations: 50,
      activate: value => value >= 0 ? 1 : 0,
      ...options
    };

    // console.log('options: ', options.activate);
    this.weights = [];
    this.trainingSet = [];
  }

  init(inputs) {
    // Initialize weights to 0 and adding bias weight
    this.weights = [ ...inputs.map(i => Math.random()), this.options.bias ];
  }

  train(inputs, expected) {
    // console.log('len', this.weights.length);
    if (!this.weights.length) {
      this.init(inputs);
    }

    // console.log('weights...', this.weights);

    if (inputs.length != this.weights.length) {
      inputs.push(this.options.bias); // Adding the bias
    }

    // Keeping this in the training set if it didn't exist
    if (!this.trainingSet.find(t => t.inputs.every((inp, i) => inp === inputs[i]))) {
      this.trainingSet.push({ inputs, expected });
    }

    const actual = this.evaluate(inputs);
    // console.log('evaluate actual', actual);

    if (actual === expected) {
      return true; // Correct weights return and don't touch anything.
    }

    // Otherwise update each weight by adding the error * learningRate relative to the input
    // Update
    this.weights = this.weights.map((w, i) => w += this.delta(actual, expected, inputs[i]));

    return this.weights;
  }

  // Calculates the difference between actual and expected for a given input
  delta(actual, expected, input) {
    const error = expected - actual; // How far off were we
    // console.log('error...', error);
    return error * this.options.learningRate * input;
  }

  // Iterates until the weights are correctly set
  learn(iterations = this.options.iterations) {
    console.log('learn');
    let success = false;
    let count = 0;
    while (!success) {
      success = this.trainingSet.every(t => this.train(t.inputs, t.expected) === true);
      if (success) {
        console.log('success after...', count);
      }
      count++;
      if (count >= iterations) {
        console.log('break', count);
        break;
      }

      if (count % 100 === 0) {
        console.log('it', count);
      }
    }
    return count;
  }

  // Sum inputs * weights
  weightedSum(inputs = this.inputs, weights = this.weights) {
    if (weights.every(weight => !isNaN(parseFloat(weight)))) {
      // console.log('weighted sum', weights);
    } else if (weights.some(weight => isNaN(parseFloat(weight)))) {
      // console.log('some...', weights);
    }

    return inputs.map((inp, i) => inp * weights[i]).reduce((x, y) => x + y, 0);
  }

  // Evaluate using the current weights
  evaluate(inputs) {
    return this.activate(this.weightedSum(inputs));
  }

  // Sugar syntax evaluate with added bias input
  predict(inputs) {
    return this.evaluate([ ...inputs, this.options.bias ]);
  }

  // Heaviside as the activation function
  activate(value) {
    const act = this.options.activate(value);
    // console.log('act...', act);
    return act;
    let result = value >= 0 ? 1 : 0;
    // result = Math.max(0, value);
    // result = 1 / ( 1 + Math.pow( Math.E, -value ) );
    // console.log('activate?', value, '-> ', result);
    // return value;
    return result;
  }

}

module.exports = Perceptron;
