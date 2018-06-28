const { DOMParser } = require('@benignware/htmldom2');
const config = require('../config/article');
const { QuerySelectorPlugin } = require('./plugins/QuerySelector');
// const Text2TagPlugin = require('./plugins/Text2TagPlugin');

module.exports = function txt2tag(source, options = {}) {
  const {
    mimeType,
  } = {
    mimeType: 'text/html',
    ...options
  };

  const document = DOMParser.parseFromString(source, mimeType);
  const element = document.documentElement;

  const plugins = config.plugins.map(
    ({ name, options }) => new (require(`${__dirname}/plugins/${name}`))(options)
  );

  plugins
    .filter(({ load }) => load)
    .forEach(plugin => plugin.load(document));

  const getDescendants = (node, level = 0) => {
    let result = [];
    if (node.nodeType === 1) {
      score = plugins.reduce((current, plugin) => current + plugin.match(node), 0);
      const len = node.querySelectorAll('*').length;
      const ratio = score > 0 ? len / score : 0;
      const item = { score, node, level, len, ratio };
      result = [item];
      const children = [].slice.call(node.childNodes);
      const items = children.forEach(child => {
        const items = getDescendants(child, level + 1);
        items.forEach(({ score: childScore = 0 }) => {
          item.score+= childScore;
          console.log('add item score ', children.length, level, childScore);
        });
        result.push(...items);
      }, []);
    }
    return result;
  };

  const result = getDescendants(element);
  // const sorted = result.sort((a, b) => b.score - a.score);
  const sorted = result.sort((a, b) => b.ratio - a.ratio);

  const debug = result.map(({ node: { nodeName, textContent = '' } = {}, score, len, ratio }) =>
    `${nodeName} - ${score}, len: ${len}, ratio: ${ratio} - ${textContent.substring(0, 50)}`);

  console.log(debug);
};
