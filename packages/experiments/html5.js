const { DOMParser } = require('./htmldom2');
const OneHotEncoder = require('./features/OneHotEncoder');
const BagOfWordsEncoder = require('./features/BagOfWordsEncoder');
const { camelizeKeys } = require('humps');
const synaptic = require('synaptic');
const { existsSync, readFile, writeFile } = require('fs');
const { sync: mkdirpSync } = require('mkdirp');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const fetchDocuments = (cacheDir => {
  return (...url) => Promise.all(url.map(url => {
    const file = path.join(cacheDir, crypto.createHash('md5').update(url).digest("hex") + '.html');
    let promise;

    if (existsSync(file)) {
      console.log('get from cache', file);
      promise = readFileAsync(file, 'utf-8');
    } else {
      promise = fetch(url)
        .then(response => response.text())
        .then(text => {
          if (!existsSync(cacheDir)) {
            mkdirpSync(cacheDir);
          }
          writeFileAsync(file, text);
          return text;
        });
    }

    return promise.then(string => DOMParser.parseFromString(string, 'text/html'));
  }));
})('./test/fixtures/web/pages/cache');

const getCandidates = (element, level = 0) => {
  element = element.documentElement || element;
  const tagName = element.nodeName.toUpperCase();

  let result = [];

  if (tagGroups.functional.includes(tagName)) {
    return result;
  }

  let props = {
    tagName: tagName,
    tags: Object.assign({}, ...tagNames.map(tagName => ({
      [tagName]: 0
    })))
  };

  const children = [].slice.call(element.childNodes);

  for (let child of children) {
    if (child.nodeType === 1) {
      const items = getCandidates(child, level + 1);
      props = items.reduce((curr, { tagName, tags }) => {
        if (typeof curr.tags[tagName] === 'undefined') {
          // console.log('UNKNOWN TAG', tagName);
          return curr;
        }
        // console.log('textContent: ', textContent.substring(0, 50));
        return ({
          ...curr,
          tags: {
            ...curr.tags,
            [tagName]: curr.tags[tagName] + 1
          },
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

const tagGroups = {
  functional: [
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'HEAD'
  ],
  semantic: [
    'A', 'ADDRESS', 'B', 'BASE', 'BLOCKQUOTE', 'BR', 'BUTTON', 'CITE', 'CODE', 'DD', 'DIR', 'DL', 'DT', 'EM', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'INPUT', 'ISINDEX', 'KBD', 'LABEL', 'LI', 'LINK', 'LISTING', 'MENU', 'META', 'NEXTID', 'OL', 'OPTION', 'P', 'PLAINTEXT', 'PRE', 'SAMP', 'SELECT', 'STRONG', 'TEXTAREA', 'TITLE', 'TT', 'UL', 'VAR', 'XMP'
  ],
  extended: [
    'ARTICLE', 'NAV', 'SECTION', 'HEADER', 'FOOTER', 'FIGURE', 'FIGCAPTION', 'ASIDE'
  ],
  solecistic: [
    'DIV', 'SPAN'
  ]
};

const tagNames = Object.values(tagGroups).reduce((result, groupNames) => [ ...result, ...groupNames ], []);

const docs = [
  'https://en.wikipedia.org/wiki/Bag-of-words_model',
  'http://www.spiegel.de/politik/deutschland/afd-aerger-um-berliner-stasi-gedenkstaette-a-1222428.html',
  'https://edition.cnn.com/2018/08/12/uk/woody-johnson-uk-us-iran-intl/index.html',
  'https://www.spektrum.de/kolumne/mercators-magie/1583692',
  'https://www.theguardian.com/politics/2018/aug/12/boris-johnson-must-face-full-inquiry-muslim-leaders-tell-may',
  'https://www.cbsnews.com/news/cory-lovelace-curtis-lovelace-case-did-illinois-mother-die-from-alcohol-abuse-or-was-she-murdered/',
  'https://www.washingtonpost.com/politics/courts_law/brett-kavanaugh-and-the-end-of-the-regulatory-state-as-we-know-it/2018/08/12/22649a04-9bdc-11e8-8d5e-c6c594024954_story.html?utm_term=.13df07ca799e'
];

const main = async() => {
  const documents = await fetchDocuments(...docs);
  let data = documents.reduce((result, document) => {
    const candidates = getCandidates(document.body);

    const hasExtendedTags = candidates.some(candidate => tagGroups.extended.includes(candidate.tagName));

    if (hasExtendedTags) {
      result.basic.push(...candidates);
    } else {
      result.extended.push(...candidates);
    }
    return result;
  }, { extended: [], basic: [] });

  // data = data.filter(entry => tagGroups.extended.includes(entry.tagName));

  console.log('---->', data.extended.length, data.basic.length);

  const tags = data.extended
    .map(candidate => {
      return Object.entries(candidate.tags).reduce((result, [ tag, count ]) => result.concat(Array(count).fill(tag)), []);
    });

  const inputEncoder = new BagOfWordsEncoder(tags);
  const outputEncoder = new OneHotEncoder(tagNames);

  const trainingData = data.extended
    // .filter(entry => tagGroups.extended.includes(entry.tagName))
    .map(entry => {
      // console.log('train', entry.tagName);
      return {
        input: inputEncoder.encode(entry.tags),
        output: outputEncoder.encode(entry.tagName)
      }
    });
  //
  const myNetwork = new synaptic.Architect.Perceptron(inputEncoder.size, 6, outputEncoder.size);
  const trainer = new synaptic.Trainer(myNetwork);
  //
  const iterations = 20;

  for (let i = 0 ; i < 70 ; i++) {
    trainer.train(trainingData, {
      rate: 0.01,
      iterations,
      shuffle: true,
      cost: synaptic.Trainer.cost.MSE
    });
    var error = trainer.test(trainingData)["error"];
    console.log(
       "Iteration " + ((i + 1) * iterations) + " --> Error: " + error
    );
  }

  const results = data.extended
    .map(entry => {
      const input = inputEncoder.encode(entry.tags);
      const output = myNetwork.activate(input);

      // console.log('output: ', output);x

      const actual = outputEncoder.decode(output);
      const expected = entry.tagName;

      console.log('PREDICT', expected, ' -> result: ', actual);

      return {
        actual: actual,
        expected: expected
      };
    });

  const accuracy = results.reduce((result, { actual, expected }) => result + (actual === expected ? 1 : 0), 0) / results.length;

  console.log('accuracy', accuracy);
};

main();
