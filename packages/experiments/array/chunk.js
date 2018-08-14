const chunk = (array, n) => {
  const r = Array(Math.ceil(array.length / n)).fill();
  return r.map((e,i) => array.slice(i * n, i * n + n));
};

module.exports = chunk;
