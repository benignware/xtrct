const $options = Symbol('options');

const tokenize = string => string.match(/\w+/g);

class BagOfWordsEncoder {
  constructor(sample) {
    this[$options] = {
      indices: new Set(sample.reduce((result, entry) => {
        return [ ...result, ...(typeof entry === 'string' ? tokenize(entry) : entry) ];
      }, []))
    }
  }

  get size() {
    return this[$options].indices.size;
  }

  encode(words) {
    const { indices: [ ...indices ] } = this[$options];

    words = typeof words === 'string'
      ? words.split(/\s+/)
      : words;

    const distribution = words[Symbol.Iterator]
      ? words.reduce((result, value) => ({
          ...result, [value]: result[value] + 1
        }), Object.assign(...indices.map(key => ({ [key]: 0 }))))
      : words;

    return Object.values(distribution);
  }

  decode(array) {
    const { indices: [ ...indices ] } = this[$options];
    const words = array.reduce((result, count, index) => {
      return result.concat(Array(count).fill(indices[index]));
    }, []);

    return words;
  }
}

// const bowEncoder = new BagOfWordsEncoder([
//   'John likes to watch movies. Mary likes movies too.',
//   'John also likes to watch football games.'
// ]);
//
// const encoded = bowEncoder.encode('John also likes Mary Mary');
//
// console.log('encoded: ', encoded);
//
// const decoded = bowEncoder.decode(encoded);
//
// console.log('decoded', decoded);

module.exports = BagOfWordsEncoder;
