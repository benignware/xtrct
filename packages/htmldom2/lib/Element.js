const DOMImplementation = require('./DOMImplementation')

class Element extends (
  DOMImplementation
    .prototype
    .createDocument
    .call(DOMImplementation)
    .createElement('element')
    .constructor
  ) {
    hello() {
      
    }
  };

console.log('Element: ', Element.prototype);

module.exports = Element;
