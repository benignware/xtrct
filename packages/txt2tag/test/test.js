const { readFileSync } = require('fs');
const { resolve } = require('path');

const txt2tag = require('..');

describe('txt2tag', () => {
  const source = readFileSync(`${__dirname}/fixtures/example.html`, 'utf-8');

  it('extract semantic parts of the document', () => {
    const result = txt2tag(source);
    console.log('result...', result);
  });
});
