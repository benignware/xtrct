const Element = require('./Element');
const DOMParser = require('./DOMParser');

module.exports = class HTMLElement extends Element {
  set innerHTML(source) {
    while (this.lastChild) {
      this.removeChild(this.lastChild);
    }
    if (source) {
      const wrap = `<html><body>${source}</body></html>`;
      const document = DOMParser.parseFromString(wrap, 'text/html');
      for (let child of document.body.childNodes) {
        this.appendChild(child);
      }
    }
  }
};
