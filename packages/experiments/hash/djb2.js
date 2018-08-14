/**
  djb2 by Dan Bernstein
  @see http://www.cse.yorku.ca/~oz/hash.html
  @see https://github.com/darkskyapp/string-hash
*/
module.exports = string => {
  const size = 4294967295;

  let hash = 5381;
  let i = string.length;

  while (i >= 0) {
    hash = (hash * 33) ^ string.charCodeAt(--i);
  }

  hash = hash >>> 0;

  // hash = hash % size / size;

  return hash;
}
