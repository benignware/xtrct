const $options = Symbol('options');

class AsciiEncoder {
  constructor(options = {}) {
    this[$options] = {
      caseSensitive: true,
      suffix: false,
      length: 0,
      max: 255,
      ...options
    };
  }

  prepare(sample = []) {
    this[$options] = {
      ...this[$options],
      max: sample.reduce((result, string) => [ ...string ].reduce((result, char) => Math.max(result, char.charCodeAt(0)), result), 0),
      length: Math.max(...sample.map(value => value.length))
    };
  }

  get size() {
    return this[$options].length;
  }

  encode(string) {
    const { max, suffix, length, caseSensitive } = this[$options];

    string = caseSensitive ? string : string.toLowerCase();

    if (suffix) {
      string = string.substring(string.length - length);
    } else {
      string = string.substring(0, length);
    }

    let result = [ ...string ].map((char, index) => {
      return string.charCodeAt(index) / max;
    });

    const rest = Array(length - string.length).fill(0);

    if (suffix) {
      result = [ ...rest, ...result ];
    } else {
      result = [ ...result, ...rest ];
    }

    if (result.length !== length) {
      throw new Error(`Error length ${result.length} != ${length}, ${result}`);
    }

    return result;
  }

  decode(array) {
    const { max } = this[$options];

    return array.map(charCode => String.fromCharCode(charCode * max)).join('');
  }
}

// const test = 'Hello World!';
//
// const encoder = new AsciiEncoder();
// const encoded = encoder.encode(test);
//
// console.log('encoded: ', encoded);
//
// const decoded = encoder.decode(encoded);
// console.log('decoded: ', decoded);


module.exports = AsciiEncoder;
