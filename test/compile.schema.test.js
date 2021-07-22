const { expect } = require("@jest/globals");
const mapConstraints = require("../src/compile.schema");

test("assessing buildSchema output", () => {
  let truePaths = new Set([ ["email"], ["credential", "password"], ["credential", "token", "access_token"] ]);
  let paths = mapConstraints({
    email: {
      _isLeaf: true,
    },
    credential: {
      password: {
        _isLeaf: true,
      },
      token: {
        access_token: {
          _isLeaf: true,
        },
      },
    },
  });
  paths = paths.map(val => val.path);
  paths = new Set(paths);

  expect(paths).toEqual(truePaths);
});
