// // matrixMultiply :: Num a => [[a]] -> [[a]] -> [[a]]
//    const matrixMultiply = (a, b) => {
//        const bCols = transpose(b);
//        return a.map(aRow => bCols.map(bCol => dotProduct(aRow, bCol)));
//    }
//
//    // dotProduct :: Num a => [[a]] -> [[a]] -> [[a]]
//    const dotProduct = (xs, ys) => sum(zipWith(product, xs, ys));
//
//
//    // GENERIC
//
//    // zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
//    const zipWith = (f, xs, ys) =>
//        xs.length === ys.length ? (
//            xs.map((x, i) => f(x, ys[i]))
//        ) : undefined;
//
//    // transpose :: [[a]] -> [[a]]
//    const transpose = xs =>
//        xs[0].map((_, iCol) => xs.map(row => row[iCol]));

   // sum :: (Num a) => [a] -> a
   // const sum = xs =>
   //     xs.reduce((a, x) => a + x, 0);

   // product :: Num a => a -> a -> a
   // const product = (a, b) => a * b;

   const flatten = matrix => [].concat(...matrix);

   const product = (...values) => values.reduce((curr, value) => curr * value);

// const dim = (...size) => {
//   return Array.from(new Array(size.shift()), (val, index) => index);
//
//   const r = size.reduce((acc, curr) => {
//      Array.from(new Array(N),(val,index)=>index);
//   });
//
//   // return size.reduceRight((prev, curr) => Array.from(Array(curr).keys()), new Array());
//   //
//   //
//   // size.reduce((prev, curr, index) => {
//   //   console.log(index, 'result: ', result.length, next);
//   //   return Array.of([ ...prev ])
//   // }, new Array(size));
// };

const dim = (...size) => size.reduceRight((prev, size) => {
  console.log('reduce right', prev, size);

  const r = Array.from(prev, x => prev.slice());


  return r;
}, new Array(size));

// Typed array views work pretty much like normal arrays.
// var f64a = new Float64Array(8);
// f64a[0] = 10;
// f64a[1] = 20;
// f64a[2] = f64a[0] + f64a[1];

//size.reduceRight((prev, next) => Array.from(prev), new Array())

const transpose = matrix => Object.entries(matrix)
  .reduce((result, [ index, entry ]) => Object.entries(entry)
    .reduce((result, [ key, value ]) => ({
      ...result,
      [key]: [ ...(result[key] || []), value ]
    }), result), {});

module.exports = {
  product,
  flatten,
  dim,
  transpose
};
