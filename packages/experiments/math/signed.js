function isNegativeZero(x) {
  return x === 0 && (1/x < 0);
}

// function isNegativeZero(x) {
//     if (x !== 0) return false;
//     var obj = {};
//     Object.defineProperty(obj, 'z', { value: -0, configurable: false });
//     try {
//         // Is x different from z’s previous value? Then throw exception.
//         Object.defineProperty(obj, 'z', { value: x });
//     } catch (e) {
//         return false
//     };
//     return true;
// }


function signed(x) {
  if (x === 0) {
    // isNegativeZero() will be shown later
    return isNegativeZero(x) ? "-0" : "+0";
  } else {
    // Otherwise, fall back to the default
    // We don’t use x.toString() so that x can be null or undefined
    return Number.prototype.toString.call(x);
  }
}

module.exports = signed;
