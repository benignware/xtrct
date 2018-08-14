const { DOMParser } = require('./htmldom2');
const { readFileSync } = require('fs');

const semanticTags = [
    'A', 'ADDRESS', 'B', 'BASE', 'BLOCKQUOTE', 'BODY', 'BR', 'CITE', 'CODE', 'DD', 'DIR', 'DL', 'DT', 'EM', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEAD', 'HR', 'HTML', 'I', 'IMG', 'INPUT', 'ISINDEX', 'KBD', 'LI', 'LINK', 'LISTING', 'MENU', 'META', 'NEXTID', 'OL', 'OPTION', 'P', 'PLAINTEXT', 'PRE', 'SAMP', 'SELECT', 'STRONG', 'TEXTAREA', 'TITLE', 'TT', 'UL', 'VAR', 'XMP',
];
const otherTags = [
  'DIV', 'SPAN'
];
const tags = semanticTags.concat(otherTags);

const getCandidates = (element, level = 0) => {
  element = element.documentElement || element;
  const tagName = element.nodeName.toUpperCase();
  let props = {
    element: element,
    nodeName: element.nodeName,
    semantic: element.getAttribute('data-semantic') || 'none',
    tagName: tags.includes(tagName) ? tagName : otherTags[0],
    textContent: '',
    tags: Object.assign({}, ...tags.map(tagName => ({
      [tagName]: 0
    })))
  };
  let result = [];
  const children = [].slice.call(element.childNodes);

  for (let child of children) {
    if (child.nodeType === 1) {
      const items = getCandidates(child, level + 1);
      props = items.reduce((curr, { tagName, textContent, tags }) => {
        return ({
          ...curr,
          tags: {
            ...curr.tags,
            [tagName]: curr.tags[tagName] + 1
          },
          textContent: curr.textContent + textContent
        });
      }, props);
      result = result.concat(items);
    } else if (child.nodeType === 3) {
      props.textContent+= child.nodeValue + '\n';
    }
  }

  result = result.concat([props]);

  return result;
};


const source = readFileSync('./test/fixtures/web/pages/example.html', 'utf-8');
const document = DOMParser.parseFromString(source, 'text/html');

const candidates = getCandidates(document.body);

const samples = candidates.map(candidate => {
  // console.log('candidate: ', candidate.tagName, '->', candidate.tags, ' -> ', candidate.semantic);
  const bagoftags = tags.map(tag => candidate.tags[tag]);
  return {
    input: bagoftags,
    output: candidate.semantic
  }
});

console.log(samples);
