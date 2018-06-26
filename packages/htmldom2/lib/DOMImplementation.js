const { DOMImplementation: XMLDOMImplementation } = require('xmldom');
const HTMLDocument = require('./HTMLDocument');

const NS = 'http://www.w3.org/1999/xhtml';

class DOMImplementation extends XMLDOMImplementation {
  createHTMLDocument(title) {
    const document = this.createDocument(NS, 'html', null);
    Object.setPrototypeOf(document, HTMLDocument.prototype);
    const html = document.createElementNS(NS, 'html');
    const body = document.createElementNS(NS, 'body');
    html.appendChild(body);
    document.appendChild(html);
    return document;
  }
}

module.exports = DOMImplementation;
