const LEADING = /^["'’]/;
const TRAILING = /["'!?.,;]$/;

const specialCases = [
  'I\'m'
];

const tokenizeSubstring = (substring) => {
  console.log('***** substring: `' + substring + '`');
  const leading = [];
  const trailing = [];

  while(!specialCases.includes(substring)) {
    match = substring.match(LEADING);
    if (match) {
      console.log('leading match', match[0]);
      leading.push(match[0]);
      substring = substring.substring(match[0].length);
    } else {
      match = substring.match(TRAILING);
      if (match) {
        console.log('trailing match', match[0]);
        trailing.push(match[0]);
        substring = substring.substring(0, substring.length - match[0].length);
      } else {
        break;
      }
    }
    console.log('rest ', substring);
  }

  console.log('===>', substring);

  if (match) {
    console.log('punct');
  }

  return [
    substring
  ];
};


const tokenize = (text) => {
  const tokens = [];

  let substring;
  let subtokens;

  for (substring of text.split(/\s+/)) {
    subtokens = tokenizeSubstring(substring);
    tokens.push(...subtokens);
  }

  return tokens;
};

module.exports = tokenize;
