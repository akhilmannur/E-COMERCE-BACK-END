const Joi = require("@hapi/joi");

const joiProductValidationSchema = Joi.object({
  title: Joi.string(),
  price: Joi.number().positive(),
  image: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
});

module.exports = { joiProductValidationSchema };
