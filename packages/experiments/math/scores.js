const mean = require('./mean');
const deviation = require('./deviation');

const scores = (...values) => {
	const avg = mean(...values);
	const sdm = deviation(...values);

	return values.map(value => (value - avg) / sdm);
}

module.exports = scores;
