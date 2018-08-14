const { djb2 } = require('.');

class HashTable {
  constructor(options = {}) {
    this.options = {
      hash: djb2,
      ...options
    };
    this.map = new Map();
  }

  set(string) {
    const hash = this.options.hash();

    this.map.set(hash, string);
    return hash;
  }

  get(hash) {
    return this.map.get(hash);
  }
}
