const { DOMParser } = require('@benignware/htmldom2');
const config = require('../config/article');
const { getCommonAncestor, isChildOf } = require('./utils');
const { default: normalize } = require('normalize-text');
const stopwords = require('stopwords-json');
const langdetect = require('langdetect');

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

  get language() {
    return langdetect(this.toString());
  }

  normalize() {
    return normalize(this.toString());
  }

  get terms() {

  }

  get words() {
    return this.toString().split(/\W+/);
  }

  get lexicalDensity() {
    return this.words.length / this.words.filter(stopwords[this.language].includes(value)).length;
  };
}

const text = new Text('Hello World');

console.log(text.toString());

module.exports = function txt2tag(source, options = {}) {
  const {
    mimeType,
  } = {
    mimeType: 'text/html',
    ...options
  };

  const document = DOMParser.parseFromString(source, mimeType);
  const element = document.documentElement;

  const getCandidates = (element, level = 0) => {
    let props = {
      text: ''
    };
    let result = [];
    const children = [].slice.call(element.childNodes);

    for (let child of children) {
      if (child.nodeType === 1) {
        const items = getCandidates(child, level + 1);
        props = items.reduce((curr, { text }) => {
          return ({
            text: curr.text + text
          });
        }, props);
        result = result.concat(items);
      } else if (child.nodeType === 3) {
        props.text+= child.nodeValue + '\n';
      }
    }

    result = result.concat([props]);

    return result;
  };


  const candidates = getCandidates(document.documentElement);

  candidates = candidates.map(candidate => {
    return
  });

};
