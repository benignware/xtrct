const zip = (matrix) => {
  const a = [].concat(...matrix.entries());
  return chunks(a, a.length / matrix.length);
};

module.exports = zip;
