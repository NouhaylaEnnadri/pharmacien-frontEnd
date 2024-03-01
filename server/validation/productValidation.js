const Joi = require("joi");
const productValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255),
    description: Joi.string().required(),
    date: Joi.date(),
    category: Joi.string(),
    subCategory: Joi.string(),
    image: Joi.string(),
  });
  return schema.validate(data);
};
module.exports.productValidation = productValidation;
