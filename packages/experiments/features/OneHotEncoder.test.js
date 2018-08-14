const OneHotEncoder = require('./OneHotEncoder');
const { strict: assert } = require('assert');

describe('OneHotEncoder', () => {
  const sample = [
    'one-hot-one',
    'one-hot-two',
    'one-hot-three'
  ];
  let encoder;

  beforeEach(() => {
    encoder = new OneHotEncoder();

    encoder.prepare(sample);
  });

  it('encodes string', () => {
    const array = encoder.encode('one-hot-two');

    assert.deepEqual(array, [ 0, 1, 0 ]);
  });

  it('decodes array', () => {
    const string = encoder.decode([ 0, 1, 0 ]);

    assert.deepEqual(string, 'one-hot-two');
  })
});
