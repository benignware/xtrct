const { djb2 } = require('./hash');

const PrimitiveType = Symbol('primitiveType');

class FeatureEncoder {
  constructor(options = {}) {
    this.options = {
      hash: false,
      ...options
    };
    this.features = new Map();
  }

  encode(instance) {
    const options = this.options;
    const hash = typeof options.hash === 'function'
      ? options.hash
      : djb2;
    const isPrimitive = typeof instance !== 'object';

    let key;
    let value;
    let numeric;
    let index;
    let feature;

    if (isPrimitive) {
      key = PrimitiveType;
      value = instance;
      numeric = parseFloat(value);

      feature = this.features.get(key) || {
        table: new Map()
      };

      if (isNaN(numeric)) {
        if (options.hash) {
          numeric = hash(value);
        } else {
          index = [ ...feature.table.values() ].indexOf(value);
          numeric = index >= 0 ? index : feature.table.size;
        }
        feature.table.set(numeric, value);
      }

      this.features.set(key, feature);

      return [numeric];
    }

    // Object
    const keys = [ ...Object.keys(instance) ].slice().sort();
    let result = [];

    for (key of keys) {
      value = instance[key];
      numeric = parseFloat(value);
      feature = this.features.get(key) || {
        name: key,
        table: new Map()
      };

      if (isNaN(numeric)) {
        console.log('options.hash:', options.hash);
        if (options.hash) {
          numeric = hash(value);
        } else {
          // NOTE: Reverse lookup is potentially slow, but we're assuming short indexed lists
          index = [ ...feature.table.values() ].indexOf(value);
          numeric = index >= 0 ? index : feature.table.size;
        }
        feature.table.set(numeric, value);
      }

      this.features.set(key, feature);
      result.push(numeric);
    }

    return result;
  }

  decode(features) {
    if (this.features.has(PrimitiveType)) {
      // Primitive
      return this.features.get(PrimitiveType).table.get(features);
    }

    // Object
    let result = {};

    let float;
    let value;
    let index = 0;

    for (let [ key, { name, table } ] of this.features.entries()) {
      float = features[index];
      console.log('float', float);
      value = table.get(float) || float;

      if (key === PrimitiveType) {
        result = value;
        break;
      } else {
        result[name] = value;
      }

      index++;
    }

    return result;
  }
}

module.exports = FeatureEncoder;
