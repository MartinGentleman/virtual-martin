const isObjectEqual = a => b => {
  const keys1 = Object.keys (a).sort ();
  const keys2 = Object.keys (b).sort ();

  if (keys1.length !== keys2.length) return false;

  if (!keys1.every (((k, i) => (k === keys2[i])))) return false;

  return keys1.every (((kk) => {
    const v1 = a [kk];
    const v2 = b [kk];
    if ( Array.isArray(v1) )  {
      return isArrayEqual (v1) (v2);
    } else if ( typeof v1 === "object" && v1 !== null) {
      return isArrayEqual (v1) (v2);
    } else {
      return  v1 === v2;
    }
  }));
};

const isArrayEqual = a => b =>
  (a.length !== b.length) ?
    false :
    Array.prototype.every.call (
      a,
      ((x, i) => {
        const y = b [i];
        if (Array.isArray (x)) {
          if (!Array.isArray (y)) return false;
          else return isArrayEqual (x) (y);
        } else if ( typeof x === 'object' ) {
          if (! ( typeof y === 'object')) return false;
          else return isObjectEqual (x) (y);
        } else {
          return (x === y);
        }
      })
    );

const isEqual = a => b =>
  (typeof a !== typeof b) ? false :
    (typeof a === 'object')  ? isObjectEqual (a) (b) :
     (Array.isArray (a)) ? isArrayEqual (a) (b) :
       (a === b);

module.exports = {
  isEqual
};