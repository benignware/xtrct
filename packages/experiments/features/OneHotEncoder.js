const $options = Symbol('options');

class OneHotEncoder {
  constructor(options = {}) {
    this[$options] = {
      keys: [],
      ...options
    };
  }

  prepare(sample) {
    this[$options] = {
      ...this[$options],
      keys: [ ...new Set(sample) ]
    };
  }

  get size() {
    return this[$options].keys.length;
  }

  encode(string) {
    const { keys } = this[$options];
    const result = Array(keys.length).fill(0);
    const index = keys.findIndex(value => value === string);

    if (index >= 0) {
      result[index] = 1;
    }

    return result;
  }

  decode(array) {
    const { keys } = this[$options];
    const index = array.indexOf(Math.max(...array));
    const result = keys[index];

    return result;
  }
}

// const sample = [
//   'one-hot-one',
//   'one-hot-two',
//   'one-hot-three'
// ];
// const oneHotEncoder = new OneHotEncoder();
//
// oneHotEncoder.prepare(sample);
//
// const encoded = oneHotEncoder.encode('one-hot-two');
//
// console.log('encoded: ', encoded);
//
// const decoded = oneHotEncoder.decode(encoded);
//
// console.log('decoded...', decoded);

module.exports = OneHotEncoder;
