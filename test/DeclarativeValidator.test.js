const { expect } = require("@jest/globals");
const constrain = require("../src/create-constraint");
const DeclarativeValidator = require("../src/declarative-validator");

test("validator throws error based on field assessment ", () => {
 
    let validator = new DeclarativeValidator({
     email: constrain({
      isEmail: () => true
     }),
     password: constrain({
      isComplexEnough: (val) => val.length > 6
     })
    });
    
    expect(() => validator.validate({ email: "mos@g.com", password: "1234567" })).not.toThrow();
    expect(() => validator.validate({ email: "mos@g.com", password: "1234" })).toThrow();
  
});

test("testing custom validators with message undefined", () => {
 
    let validator_0 = new DeclarativeValidator({
     email: constrain({
      isEmail: () => true
     }),
     password: constrain({
      isComplexEnough: {
        validator: (val) => val.length > 6, 
      }
     })
    });
    
    expect(() => validator_0.validate({ email: "mos@g.com", password: "1234" })).toThrow();
  
});