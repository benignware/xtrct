const path = require('path');
const { readFileSync } = require('fs');
const { strict: assert } = require('assert');
const { serializeToString, loadDocument } = require('./utils');

const HTMLElement = require('../lib/HTMLElement');

describe('HTMLElement', function() {
  const document = loadDocument(`${__dirname}/fixtures/example.html`);

  describe('querySelectorAll', () => {
    it('selects elements by css query', () => {
      const elements = document.documentElement.querySelectorAll('h1');

      assert.deepStrictEqual(elements.map(({ nodeName }) => nodeName), [ 'h1' ]);
    });
  });
  describe('querySelector', () => {
    it('selects a single element by css query', () => {
      const element = document.documentElement.querySelector('h1');

      assert.deepStrictEqual(element.nodeName, 'h1');
    });
  });
});
