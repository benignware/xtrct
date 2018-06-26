const { DOMImplementation } = require('xmldom');
const XMLDocument = DOMImplementation
  .prototype
  .createDocument
  .call(DOMImplementation)
  .constructor;

module.exports = class Document extends XMLDocument {
};
