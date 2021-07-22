const buildSchema = require("./compile.schema");

class SchemaValidator {
  schema;

  constructor(constraints) {
    this.schema = buildSchema(constraints);
  }

  validate(obj) {
    let destNode;
    let parentNode;
    let err_stack = new Array();

    this.schema.forEach((field) => {
      let field_name = field.path[field.path.length - 1];
      destNode = obj;

      field.path.forEach((node, index) => {
        try {
          destNode = destNode[node];
          if (index === field.path.length - 2) parentNode = destNode;
        } catch {
          throw new SchemaObjectMismatchError("SCHEMA_OBJECT_MISMATCH");
        }
      });

      Object.keys(field.validations).forEach((key) => {
        let _eval;

        if (key === "_isLeaf") return;

        if (typeof field.validations[key] === "function") {
          _eval = field.validations[key](destNode, parentNode);
          if (_eval) return;
          err_stack.push(`${key} validator deems the field ${field_name} invalid.`);
        } else if (typeof field.validations[key] === "object") {
          _eval = field.validations[key].validator(destNode, parentNode);
          if (_eval) return;
          let err_msg = field.validations[key].message;
          if (typeof err_msg === "undefined") err_stack.push(`${key} validator deems the field ${field_name} invalid.`);
          else if (typeof err_msg !== "function") err_stack.push(err_msg);
          else if (typeof err_msg === "function") err_stack.push(err_msg(field_name, key, destNode));
        }
      });
    });

    if (err_stack.length === 0) return obj;
    
    const err = new ValidationError("VALIDATION_ERROR", err_stack);
    throw err;
  }
}

class SchemaObjectMismatchError extends Error {

  constructor(message) {
    super(message);
    this.name = "SchemaObjectMismatchError";
  }  

}

class ValidationError extends Error {
  
  constructor(message, errors) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }

}

module.exports = SchemaValidator;
