const Math = require('../math');

const $options = Symbol('options');

class NumberEncoder {
  constructor(options = {}) {
    this[$options] = { ...options };
  }

  prepare(sample) {
    this[$options] = {
      ...this[$options],
      deviation: Math.deviation(...sample),
      mean: Math.mean(...sample)
    }
  }

  get size() {
    return 1;
  }

  encode(number) {
    const { deviation, mean } = this[$options];
    const zScore = (number - mean) / deviation;

    return [ zScore ];
  }

  decode(array) {
    const { deviation, mean } = this[$options];
    const zScore = array.shift();
    const number = zScore * deviation + mean;

    return number;
  }
}

// const sample = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const encoder = new NumberEncoder();
//
// encoder.prepare(sample);
//
// const array = encoder.encode(4.4);
// console.log('array...', array);
// const number = encoder.decode(array);
// console.log('number...', number);

module.exports = NumberEncoder;
