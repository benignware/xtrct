const mean = require('./mean');

const deviation = (...values) => {
  const avg = mean(...values);

  return Math.sqrt(
    mean(
      ...values.map(value => Math.pow(value - avg, 2))
    )
  );
};

module.exports = deviation;
