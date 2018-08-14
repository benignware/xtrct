const NumberEncoder = require('./NumberEncoder');
const { strict: assert } = require('assert');

describe('NumberEncoder', () => {
  const sample = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];
  let encoder;

  beforeEach(() => {
    encoder = new NumberEncoder();

    encoder.prepare(sample);
  });

  it('encodes number', () => {
    const array = encoder.encode(4.4);

    assert.deepEqual(array, [ -0.18973665961010264 ]);
  });

  it('decodes array', () => {
    const number = encoder.decode([ -0.18973665961010264 ]);

    assert.deepEqual(number, 4.4);
  })
});
