const { DOMParser } = require('@benignware/htmldom2');
const config = require('../config/article');
const { getCommonAncestor, isChildOf } = require('./utils');
const { default: normalizeText } = require('normalize-text');
console.log('normalizeText: ', normalizeText);
// const { QuerySelectorPlugin } = require('./plugins/QuerySelector');
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
    let text;
    let item = { node, level, score: 0, ratio: 0, text };

    result = [item];

    if (node.nodeType === 1) {
      // score = plugins.reduce((current, plugin) => current + plugin.match(node), 0);
      // const len = node.querySelectorAll('*').length;
      // const ratio = score > 0 ? len / score : 0;
      // TODO: strip out clutter like entities

      const children = [].slice.call(node.childNodes);
      let items;

      let value = 0;
      let score = 0;
      let count = 0;

      for (let child of children) {
        if (child.nodeType === 1) {
          items = getDescendants(child, level + 1);
          value+= items.reduce((curr, { value }) => curr + 1, 0);
          score+= items.reduce((curr, { score }) => curr + score, 0);
          count+= items.length;
          result = result.concat(items);
        }
      }

      // console.log('amount...', node.nodeName, total, count);
      // total = total > 0 ? total : 1;

      // score = count > 0 ? total / count : 0;
      // text = node.textContent.replace(/[\s\.\?,]+/g, '');
      text = normalizeText(node.textContent);
      const textValue = text.split(/\s+/).length;
      // const textValue = text.length / 300;
      const tagValue = value;

      score = tagValue > 0 ? textValue / tagValue : textValue ? textValue : 0;

      // const amount = count > 0 ? (total / count) : score;

      // score = 1 - (total / text.length);
      // Container score counts
      // score = amount > 0 ? 1 - (value / text.length) : 0;

      console.log(`${node.nodeName} - tags: ${tagValue} - txt: ${textValue} - cnt: ${count} - ${text.substring(0, 25)}`);

      // item.amount = amount;
      item.value = value;
      item.score = score;
      item.count = count;
    } else {
      text = node.data;
    }

    item.text = text;

    return result;
  };

  const result = getDescendants(element);
  // const sorted = result.sort((a, b) => b.score - a.score);
  let sorted;

  // sorted = result.slice().sort((a, b) => b.score - a.score);
  // sorted = result.slice().sort((a, b) => b.total - a.total);
  sorted = result.slice().sort((a, b) => b.total - a.total);
  // const ld = result.map((a, b) => b.level - a.level);

  const debug = items => {
    const string = items.map(({ node: { nodeName } = {}, level, text, score, value, ratio, total, count, amount }) =>
      `${nodeName} -> lev: ${level}, val: ${value}, count: ${count} score: ${score} - ${text.substring(0, 25)}`);

    console.log(string);
  }

  // debug(sorted);
  // return;

  let array = sorted.slice();
  let res = [];
  let ancestor = null;
  const containers = [];

  while(array.length > 1) {
    let curr = array.shift();
    let ancestor;
    let isChild

    // let na = [];
    // for (let item of array) {
    //   isChild = isChildOf(curr.node, item.node);
    //   if (!isChild) {
    //     na.push(item);
    //   }
    // }
    // array = na;

    isChild = false;
    // for (let item of containers) {
    //   isChild = isChildOf(curr.node, item.node);
    //   if (isChild) {
    //     break;
    //   }
    // }

    if (!isChild) {
      containers.push(curr);
    }
  }

  res = containers;

  const final = res.sort((a, b) => b.score - a.score);

  debug(final);
};
