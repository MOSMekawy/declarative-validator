function buildSchema(constraints) {
  const stack = new Array();
  const paths = new Array();
  const schema = new Array();

  stack.push(constraints);
  paths.push([]);

  while (stack.length != 0) {
    let currNode = stack.pop();
    let currPath = paths.pop();

    if (currNode._isLeaf) {
      schema.push({ validations: currNode, path: currPath });
      continue;
    }

    Object.keys(currNode).forEach((key) => {
      stack.push(currNode[key]);
      paths.push([...currPath, key]);
    });
  }

  return schema;
}

module.exports = buildSchema;
