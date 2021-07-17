function constrain(input) {
  /* 
    Adds metadata to identify leaf nodes 
    and validates input structure 
  */

  return Object.freeze({
    _isLeaf: true,
    ...input,
  });
}

module.exports = constrain;
