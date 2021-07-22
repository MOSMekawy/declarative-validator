const { expect, test } = require("@jest/globals");
const constrain = require("../src/constrain");
const SchemaValidator = require("../src/schema.validator");

test("validator throws error on mismatch between validated object and schema", () => {
  let validator = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    credential: {
      password: constrain({
        isComplexEnough: (val) => val.length > 6,
      }),
    },
  });

  expect(() => validator.validate({ email: "mos@g.com" })).toThrow(
    "SCHEMA_OBJECT_MISMATCH"
  );
});

test("validator doesn't throw based on truthy field assessment", () => {
  let validator = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    password: constrain({
      isComplexEnough: (val) => val.length > 6,
    }),
  });

  expect(() =>
    validator.validate({ email: "mos@g.com", password: "1234567" })
  ).not.toThrow();
});

test("validator throws default error based on falsy field assessment", () => {
  let validator = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    password: constrain({
      isComplexEnough: (val) => val.length > 6,
    }),
  });

  expect(() =>
    validator.validate({ email: "mos@g.com", password: "1234" })
  ).toThrow();

  try {
    validator.validate({ email: "mos@g.com", password: "1234" });
  } catch (e) {
    expect(e.errors[0]).toEqual(
      "isComplexEnough validator deems the field password invalid."
    );
  }
});

test("custom validators with message undefined throws", () => {
  let validator_0 = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    password: constrain({
      isComplexEnough: {
        validator: (val) => val.length > 6,
      },
    }),
  });

  expect(() =>
    validator_0.validate({ email: "mos@g.com", password: "1234" })
  ).toThrow();
});

test("testing custom validators with string message", () => {
  let validator_0 = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    password: constrain({
      isComplexEnough: {
        validator: (val) => val.length > 6,
        message: "custom message",
      },
    }),
  });

  try {
    validator_0.validate({ email: "mos@g.com", password: "1234" });
  } catch (e) {
    expect(e.errors[0]).toEqual("custom message");
  }
});

test("testing custom validators with custom message function", () => {
  let validator_0 = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    password: constrain({
      isComplexEnough: {
        validator: (val) => val.length > 6,
        message: (val_key, v_name, val) => `${val_key}-${v_name}-${val}`,
      },
    }),
  });

  try {
    validator_0.validate({ email: "mos@g.com", password: "1234" });
  } catch (e) {
    expect(e.errors[0]).toEqual("password-isComplexEnough-1234");
  }
});

test("validating a nested field", () => {
  let validator_0 = new SchemaValidator({
    email: constrain({
      isEmail: () => true,
    }),
    credential: {
      password: constrain({
        isComplexEnough: {
          validator: (val) => val.length > 6,
          message: (val_key, v_name, val) => `${val_key}-${v_name}-${val}`,
        },
      }),
    },
  });

  expect(() =>
    validator_0.validate({
      email: "mos@g.com",
      credential: { password: "1234567" },
    })
  ).not.toThrow();
  expect(() =>
    validator_0.validate({
      email: "mos@g.com",
      credential: { password: "1234" },
    })
  ).toThrow();
});

test("validator checks for fields and throws if they aren't available", () => {
  let validator = new SchemaValidator({
    _validations: {
      required: (node) => {
        return node.email && node.credential;
      }
    },
    email: constrain({
      isEmail: () => true,
    }),
    credential: {
      password: constrain({
        isComplexEnough: (val) => val.length > 6,
      }),
    },
  });

  expect(() => validator.validate({ email: "mos@g.com", credential: { password: "1234567" } })).not.toThrow();
  expect(() => validator.validate({ email: "mos@g.com"})).toThrow();
});
