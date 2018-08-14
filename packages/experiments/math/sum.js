const sum = (...values) => {
  const result = values.reduce((curr, value) => {
    return curr + value;
  }, 0);
  return result;
};

module.exports = sum;
