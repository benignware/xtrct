const product = (...values) => values.reduce((curr, value) => curr * value);

module.exports = product;
