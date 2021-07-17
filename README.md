# schema-validator

This package is a validator.js wrapper, that is designed to give ORM style validation (e.g mongoose or sequelize). 
It can be used with any validator as long as it resolves to a boolean value. 


```js
 
 // define schema
 
const schema = new Schema({
  // use constrain function when defining validators for a field 
  name: constrain({
   isAlpha, 
   length: {
     validator: (val) => val.length > 0,
     message: 'name can not be empty'
   }
  }),
  // handles nesting 
  credentials: {
     // create custom err messages
     password: constrain({
      isComplex: {
        validator: (val) => val.length > 8,
        message: (value_key, valid_name, value) => `${valid_name} validator deems input of value ${value} for field ${value_key} invalid`
      }
     })
  }
});

```
