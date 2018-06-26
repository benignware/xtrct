const { XMLSerializer } = require('xmldom');

module.exports = {
  serializeToString: document => (new XMLSerializer()).serializeToString(document)
};
