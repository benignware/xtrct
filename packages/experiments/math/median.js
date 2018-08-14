const median = (...values) => {
  const mid = values.length / 2;

	values.sort((a, b) => a - b);
	return mid % 1 ? values[mid - 0.5] : (values[mid - 1] + values[mid]) / 2;
};

module.exports = median;
