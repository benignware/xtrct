class Text {
  static get [Symbol.species]() { return String; }

  get [Symbol.toStringTag]() {
    return 'Text';
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return `[${this.join(', ')}]`;
    } else {
      // hint is default
      return this.toString();
    }
  }

  

  // get language() {
  //   return langdetect(this.toString());
  // }
  //
  // normalize() {
  //   return normalize(this.toString());
  // }
  //
  // get terms() {
  //
  // }

  get words() {
    return this.toString().split(/\W+/);
  }

  // get lexicalDensity() {
  //   return this.words.length / this.words.filter(stopwords[this.language].includes(value)).length;
  // };
}

const text = new Text('Hello World');
