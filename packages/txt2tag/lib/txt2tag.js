const { DOMParser } = require('@benignware/htmldom2');
const config = require('../config/article');

console.log('config: ', config);

module.exports = function txt2tag(source, options = {}) {
  const {
    mimeType,
  } = {
    mimeType: 'text/html',
    ...options
  };

  const document = DOMParser.parseFromString(source, mimeType);

  const element = document.documentElement;
  const hot = Object.entries(config).map(([ selector, score ]) => {
    console.log('element: ', element.nodeName);
    const elements = element.querySelectorAll(selector);
    console.log('SELECTOR: ', selector, elements.length);
  });

  const getDescendants = (node, level = 0) => {
    let result = [];
    if (node.nodeType === 1) {
      result = [{ score: 0, node, level }];
      const children = [].slice.call(node.childNodes);
      const items = children.forEach(child => {
        const c = getDescendants(child, level + 1);
        result.push(...c);
      }, []);
    }
    return result;
  };

  const result = getDescendants(element);
  const debug = result.map(({ node: { nodeName, textContent = '' } = {}, score }) =>
    `${nodeName} - ${score} - ${textContent.substring(0, 50)}`);

  console.log('debug...', debug);
};
