const Joi = require("@hapi/joi");

const joiUservalidationSchema = Joi.object({
  name: Joi.string(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string(),
  password: Joi.string().min(8).pattern(new RegExp("^(?=.*[A-Za-z0-9])(?=.*[@#$%^&+=!])([A-Za-z0-9@#$%^&+=!]{8,30})$")).required(),
});


module.exports = { joiUservalidationSchema}
