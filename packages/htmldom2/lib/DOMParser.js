const { DOMParser: XMLDOMParser } = require('xmldom');
const DOMImplementation = require('./DOMImplementation');
const htmlparser = require("htmlparser2");


const domTreeToW3C = (document, { type, name, attribs, children = [], data }) => {
  const nodeTypeMapping = {
    tag: () => document.createElement(name),
    text: () => document.createTextNode(data),
    comment: () => document.createComment(data)
  };
  if (!nodeTypeMapping[type]) {
    throw new Error(`Unsupported node type: ${type}`);
  }

  const node = nodeTypeMapping[type](arguments);

  for (let child of children) {
    const el = domTreeToW3C(document, child);
    node.appendChild(el);
  }
  return node;
}

class DOMParser extends XMLDOMParser {

  static parseFromString(source, mimeType = 'text/xml') {
    if (/\/x?html?$/.test(mimeType)) {
      const impl = new DOMImplementation();
      const document = impl.createHTMLDocument();
      while (document.lastChild) {
        document.removeChild(document.lastChild);
      }
      let tree;
      const handler = new htmlparser.DomHandler(function (error, dom) {
        if (error) {
          throw error;
        }
        tree = dom;
      });
      const parser = new htmlparser.Parser(handler);
      parser.write(source);
      parser.end();
      tree.forEach(el => document.appendChild(domTreeToW3C(document, el)));
      return document;
    }
  }
}

module.exports = DOMParser;
