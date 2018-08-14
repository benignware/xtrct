const sum = require('./sum');

const mean = (...values) => sum(...values) / values.length;

module.exports = mean;
