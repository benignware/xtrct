const BagOfWordsEncoder = require('./BagOfWordsEncoder');
const { strict: assert } = require('assert');

describe('BagOfWordsEncoder', () => {
  const sample = [
    'John likes to watch movies. Mary likes movies too.',
    'John also likes to watch football games.'
  ];
  let encoder;

  beforeEach(() => {
    encoder = new BagOfWordsEncoder();

    encoder.prepare(sample);
  });

  it('encodes words', () => {
    const array = encoder.encode('John also likes Mary Mary');

    assert.deepEqual(array, [ 1, 1, 0, 0, 0, 2, 0, 1, 0, 0 ]);
  });

  it('decodes array', () => {
    const words = encoder.decode([ 1, 1, 0, 0, 0, 2, 0, 1, 0, 0 ]);

    assert.deepEqual(words, [ 'John', 'likes', 'Mary', 'Mary', 'also']);
  })
});
