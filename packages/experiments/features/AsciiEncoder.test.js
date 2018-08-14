const AsciiEncoder = require('./AsciiEncoder');
const { strict: assert } = require('assert');

describe('AsciiEncoder', () => {
  let encoder;

  beforeEach(() => {
    encoder = new AsciiEncoder();

    encoder.prepare([
      'Hello World!'
    ])
  });

  it('encodes string', () => {
    const array = encoder.encode('Hello World!');

    assert.deepEqual(array, [
      0.631578947368421,
      0.8859649122807017,
      0.9473684210526315,
      0.9473684210526315,
      0.9736842105263158,
      0.2807017543859649,
      0.7631578947368421,
      0.9736842105263158,
      1,
      0.9473684210526315,
      0.8771929824561403,
      0.2894736842105263
    ]);
  });

  it('decodes array', () => {
    const string = encoder.decode([
      0.631578947368421,
      0.8859649122807017,
      0.9473684210526315,
      0.9473684210526315,
      0.9736842105263158,
      0.2807017543859649,
      0.7631578947368421,
      0.9736842105263158,
      1,
      0.9473684210526315,
      0.8771929824561403,
      0.2894736842105263
    ]);

    assert.deepEqual(string, 'Hello World!');
  })
});
