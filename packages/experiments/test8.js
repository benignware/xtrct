const fs = require('fs');
const Papa = require('papaparse');

const Perceptron = require('./perceptron');
const FeatureEncoder = require('./FeatureEncoder');
const { default: normalize } = require('./normalization');
const { min, max, mean, deviation } = require('./math');

const file = './test/fixtures/winequality-red.csv';
const source = fs.readFileSync(file, 'utf-8');

// Parse local CSV file
let { data: d } = Papa.parse(source, {
  header: true,
  dynamicTyping: true
});

const transpose = matrix => {
  const rows = Object.values(matrix);
  const columns = Object.assign({}, ...Object.keys(
    rows.reduce((a, b) => a.length > b.length ? a : b)
  ).map(key => {
    console.log('key: ', key);
    return {
      [key]: rows.map(array => array[key])
    }
  }));

  return columns;

  // Object.entries(matrix).reduce(([, a], [, b]) => a.length > b.length ? a : b).map([key]) => matrix.map(array => array[key]));
  // console.log('matrix.', matrix);
  // return matrix
  //   .reduce((a, b) => a.length > b.length ? a : b)
  //   .map((...[, index]) => matrix.map(array => array[index]));
};
//
// const m = transpose([ ['a', 'b', 'c', 'd'], [1, 2, 3], [11, 12, 13] ]);
// const t = transpose(m);

// const transpose = matrix => {
//   matrix.reduce((prev, curr) => {
//     matrix
//   })
// }

const object = {
  a: [1, 2],
  b: [6, 8]
};

const data = [{
  a: 1,
  b: 2
}, {
  a: 3,
  b: 4
}, {
  a: 5,
  b: 6
}];

const matrix = [[1, 2], [3, 4], [5, 6]];


const t = matrix =>
  Object.entries(matrix).reduce((result, [ index, entry ]) => ({
    ...result,
    ...Object.entries(entry).reduce((result, [ key, value ]) => ({
      ...result,
      [key]: {
        ...result[key],
        [index]: value
      }
    }), result)
  }), {});

const tm = matrix =>
  Object.entries(matrix).reduce((result, [ index, row ]) => ({
    ...result,
    ...Object.entries(row).reduce((result, [ key, value ]) => ({
      ...result,
      [key]: {
        ...result[key],
        [index]: value
      }
    }), {})
  }), {});


[].fill.call({ length: 3 }, 0);

// console.log('tt: ', Object.entries(object).reduce(result, [ index, row ], index) => ({
//   [key]: {
//     [index]
//   }
// }), {});
const g = matrix => Object.entries(matrix).reduce((result, [index, row]) => ({
  ...result,
  ...row
}), {});

const z = matrix => matrix.reduce(($, row) => row.map((_, i) => [...($[i] || []), row[i]]), [])


const r = matrix => matrix.reduce((result, row, index) => {
  console.log('INDEX: ', index, row);
  return {
    ...result,
    ...Object.entries(row).map(([key, value], index) => ({
      [key]: {
        ...result[key],
        [index]: value
      }
    }))
  }
}, {});

const transpose1 = matrix => Object.entries(matrix)
  .reduce((result, [ index, entry ]) => Object.entries(entry)
    .reduce((result, [ key, value ]) => ({
      ...result,
      [key]: [ ...(result[key] || []), value ]
    }), result), {});

// return [].fill.call({ length: Object.keys(head).length }, Object.values(head));
// console.log('transpose array');
// const t1 = transpose1(data);
// console.log('object: ', t1);
//
// console.log('transpose object')
// const t2 = transpose1(object);
// console.log('array: ', t2);

const chunks = (array, n) => array.slice(0, Math.ceil(array.length / n)).map((x, i) => array.slice(i * n, i * n + n));

const zz = ([ head, ...tail ]) => {
  return Object.entries(head).reduce((result, [ key, value ], index) => [ value, ...Object.values(...tail)].filter(value => ({
    ...result,
    [key]: value
  })), {});
};

const zip = (matrix) => {
  const a = [].concat(...matrix.entries());
  return chunks(a, a.length / matrix.length);
};

console.log('zz...', zip(data));

// Object.entries(head).map(([ key, value ]) => ({
//     [key]: [ value, tail[key] ]
//   }));

// console.log('T: ', Object.entries(data[0]).reduce((result, [ key, row ]) => ({
//   ...result,
//   [key]: [ row ]
// }), {}));
process.exit();

const m = [[['test1']]];
console.log('m', m);
m[0][0][6] = 'test2';

console.log('t: ', m[0][0][0]);
//
// const dim = (...size) => size.reduceRight((result, size, index, array) => {
//   return Array.from(new Array(size), () => result.slice ? result.slice() : result);
// }, 0);
const dim = (...size) => size.reduceRight((result, size, index, array) => {
  return Array.from(new Array(size), () => result.slice ? result.slice() : result);
}, 0);
//
console.log('matrix...', dim(1, 2)[0].length);


// const p = matrix[x][y][z];O
