
const sum = values => values.reduce((curr, value) => curr + value, 0);

const average = values => sum(values) / values.length;

const transpose = matrix => {
  const first = Object.values(matrix)[0];
  const result = first instanceof Array ? [] : {};

  for (let [ key, column ] of Object.entries(first)) {
    result[key] = matrix instanceof Array ? [] : {};
    for (let [ index, row ] of Object.entries(matrix)) {
      result[key][index] = row[key];
    }
  }

  return result;
}

const minimum = values => Math.min(...values);
const maximum = values => Math.max(...values);

const normalize = rows => {
  let cols = transpose(rows);

  cols = Object.assign(cols instanceof Array ? [] : {}, ...Object.entries(cols).map(([ key, values ]) => {
    const min = minimum(values);
    const max = maximum(values);
    const avg = average(values);
    values = values.map(value => (value - avg) / (max - min));
    return {
      [key]: values
    };
  }));

  return transpose(cols);
};

// const data = [
//   [ 435, 2342, 525],
//   [ 314, 656323, 534],
//   [ 54, 14, 25345]
// ];
//
// const N = normalize(data);
//
// console.log('normalized', N);

module.exports = {
  default: normalize,
  transpose
};
