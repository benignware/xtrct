const FeatureSetEncoder = require('./FeatureSetEncoder');
const OneHotEncoder = require('./OneHotEncoder');
const NumberEncoder = require('./NumberEncoder');
const { strict: assert } = require('assert');

describe('FeatureSetEncoder', () => {
  const sample = [{
    oneHot: 'one-hot-one',
    number: 0
  }, {
    oneHot: 'one-hot-two',
    number: 1
  }, {
    oneHot: 'one-hot-three',
    number: 2
  }, {
    oneHot: 'one-hot-four',
    number: 3
  }];
  let encoder;

  beforeEach(() => {
    encoder = new FeatureSetEncoder();
    encoder.set('oneHot', new OneHotEncoder());
    encoder.set('number', new NumberEncoder());
    encoder.prepare(sample);
  });

  it('encodes object', () => {
    const array = encoder.encode({
      oneHot: 'one-hot-two',
      number: 1
    });

    assert.deepEqual(array, [ 0, 1, 0, 0, -0.4472135954999579 ]);
  });

  it('decodes array', () => {
    const object = encoder.decode([ 0, 1, 0, 0, -0.4472135954999579 ]);

    assert.deepEqual(object, {
      oneHot: 'one-hot-two',
      number: 1
    });
  })
});
