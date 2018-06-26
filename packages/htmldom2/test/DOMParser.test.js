const path = require('path');
const fs = require('fs');
const { strict: assert } = require('assert');
const { serializeToString } = require('./utils');

const { DOMParser } = require('..');

describe('DOMParser', function() {
  const file = path.join(process.cwd(), 'test/fixtures/example.html');
  const source = fs.readFileSync(file, 'utf-8');

  it('parses basic html', () => {
    const document = DOMParser.parseFromString(source, 'text/html');
    assert.equal(
      serializeToString(
        DOMParser.parseFromString(document, 'text/html')
      ),
      source
    );
  });
});
