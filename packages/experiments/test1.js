const tokenize = require('./tokenize');


const result = tokenize(
  `Hello World! Richard's John’s "school" of 'music calls',
  etc. and all the stuff
  Someone listening? However, I'm talking... I can't help?`
);

console.log(result.join('$\n'));
