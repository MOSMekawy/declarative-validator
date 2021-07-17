const mapConstraints = require("./map-constraints");

class DeclarativeValidator {

   map;

   constructor(constraints) {

    this.map = mapConstraints(constraints);

   }

   validate(obj) {

    let dest;
    let err_stack = new Array;

    this.map.forEach((field) => {
      
      let field_name = field.path[field.path.length - 1];
      dest = obj;
        
      field.path.forEach((node) => {
        dest = dest[node];
      });

      Object.keys(field.validations).forEach((key) => {
       
       let _eval;

       if (key == '_isLeaf') return;

       if (typeof field.validations[key] == 'function') {
           _eval =  field.validations[key](dest);
           !_eval && err_stack.push(new Error(`${key} validator deems the field ${field_name} invalid.`));
        } else if (typeof field.validations[key] == 'object') {
            console.log(field.validations[key].validator);
           _eval = field.validations[key].validator(dest);
           if(!_eval) {
            let err_msg = field.validations[key].message;
            if (typeof err_msg != 'function') err_stack.push(new Error(err_msg));
            else err_stack.push(new Error(err_msg && err_msg(field_name, key, dest)));
           }
        }  

      });

    });

    if (err_stack.length != 0) throw new Error(err_stack);

   }



}

module.exports = DeclarativeValidator; 