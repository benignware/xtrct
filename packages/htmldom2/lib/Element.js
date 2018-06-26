const DOMImplementation = require('./DOMImplementation')

const XMLElement = DOMImplementation
  .prototype
  .createDocument
  .call(DOMImplementation)
  .createElement('element')
  .constructor;


module.exports = class Element extends XMLElement {};
