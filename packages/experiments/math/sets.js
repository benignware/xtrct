const sum = (...values) => {
  return values.reduce((curr, value) => curr + value, 0);
};

const mean = (...values) => {
  return sum(...values) / values.length;
};

const median = (...values) => {
  const mid = values.length / 2;

	values.sort((a, b) => a - b);
	return mid % 1 ? values[mid - 0.5] : (values[mid - 1] + values[mid]) / 2;
};

const deviation = (...values) => {
  const avg = mean(...values);

  return Math.sqrt(
    mean(
      ...values.map(value => Math.pow(value - avg, 2))
    )
  );
};

const variance = (...values) => {
	const avg = mean(...values);

	return mean(values.map(value => Math.pow(value - avg, 2)));
};

const scores = (...values) => {
	const avg = mean(values);
	const s = deviation(values);

	return values.map(value => (value - avg) / s);
}

module.exports = {
  sum,
  mean,
  median,
  deviation,
  variance,
  scores
}
