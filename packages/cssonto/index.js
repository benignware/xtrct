const fs = require('fs');
const parseCSS = require('css-parse');
var safe   = require('postcss-safe-parser');

const postcss = require('postcss');
// const precss = require('precss');
// const autoprefixer = require('autoprefixer');

const file = 'ontology.css';
const data = fs.readFileSync(file, 'utf-8');

const root = postcss.parse(data, { from: file });

// console.log('root: ', root);

for (let node of root.nodes) {
  if (node.type === 'atrule') {
    console.log('MY AT RULE...', node.name);
    console.log('nodes: ', node.nodes);
  }
}


// var badCss = 'a {';

// postcss(plugins).process(badCss, { parser: safe }).then(function (result) {
//     result.css //= 'a {}'
// });

// fs.readFile('src/app.css', (err, css) => {
//     postcss([precss])
//         .process(css, { from: 'src/app.css', to: 'dest/app.css' })
//         .then(result => {
//             fs.writeFile('dest/app.css', result.css, () => true);
//             if ( result.map ) {
//                 fs.writeFile('dest/app.css.map', result.map, () => true);
//             }
//         });
// });

// const css = parseCSS(data);
//
// console.log('css.stylesheet: ', css.stylesheet);
// const rules = [ ...css.stylesheet.rules ];
//
// for (let rule of rules) {
//   console.log('rule', rule);
// }

// console.log('rules: ', rules instanceof Array);
// console.log(rules.map(({ selectors }) => selectors));
