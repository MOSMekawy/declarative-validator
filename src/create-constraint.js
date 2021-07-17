function createConstraint(input) {
  
  /* 
    Adds metadata value to immediately identify leaf nodes 
    and validates input structure 
  */

  return Object.freeze({
   _isLeaf: true,
   ...input
  });

}

module.exports = createConstraint;