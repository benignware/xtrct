const $encoders = Symbol('encoders');
const $options = Symbol('options');

const transpose = data => {
  return Object.entries(data).reduce((result, [ key, cells ], y) => ({
    ...result,
    ...Object.entries(data[y]).reduce((result, [ key, cell ], x) => ({
      ...result,
      [key]: [ ...(result[key] || []), cell ]
    }), result)
  }), {});
}

class FeatureSetEncoder {
  constructor(options) {
    this[$options] = options;
    this[$encoders] = new Map();
  }

  set(property, featureEncoder) {
    const encoders = this[$encoders];

    encoders.set(property, featureEncoder);
  }

  get(property) {
    const encoders = this[$encoders];

    return encoders.get(property);
  }

  prepare(sample) {
    const transposed = transpose(sample);

    Object.entries(transposed).forEach(([ property, sample ]) => {
      this.get(property).prepare(sample);
    });
  }

  get size() {
    const encoders = this[$encoders];

    return encoders.values().reduce((result, encoder) => result + encoder.size, 0);
  }

  encode(object) {
    const encoders = this[$encoders];

    return [ ...encoders.entries() ].reduce((result, [ property, encoder ]) => {
      return [ ...result, ...encoder.encode(object[property]) ];
    }, []);
  }

  decode(array) {
    const encoders = this[$encoders];
    let i = 0;

    return Object.assign({}, ...[ ...encoders.entries() ].map(([ key, encoder ], index) => {
      const size = encoder.size;
      const part = array.slice(i, i + size);

      i+= size;

      return {
        [key]: encoder.decode(part)
      };
    }));
  }
}

module.exports = FeatureSetEncoder;
