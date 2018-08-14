
const flatten = matrix => [].concat(...matrix);

const product = (...values) => values.reduce((curr, value) => curr * value);

const dim = (...size) => size.reduceRight((prev, size) => {
  return Array.from(prev, x => prev.slice());
}, new Array(size));

const transpose = matrix => Object.entries(matrix)
  .reduce((result, [ index, entry ]) => Object.entries(entry)
    .reduce((result, [ key, value ]) => ({
      ...result,
      [key]: [ ...(result[key] || []), value ]
    }), result), {});

module.exports = {
  product,
  flatten,
  dim,
  transpose
};
