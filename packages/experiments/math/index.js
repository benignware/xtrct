module.exports = {
  ...Object.assign({}, ...Object.getOwnPropertyNames(global.Math).map(key => ({
    [key]: global.Math[key]
  }))),
  // ...require('./sets'),
  // ...require('./matrix'),
  sum: require('./sum'),
  mean: require('./mean'),
  median: require('./median'),
  deviation: require('./deviation'),
  scores: require('./scores'),
  sigmoid: require('./sigmoid'),
  // zip: require('./zip')
};
