const Joi = require("joi");

module.exports.validateSchema = async (details, validationSchema) => {
  try {
    let result = validationSchema.validate(details, {
      abortEarly: false,
      stripUnknown: false,
    });
    if (result.error && result.error.details) {
      throw result.error.details[0].message;
    } else {
      return result.value;
    }
  } catch (error) {
    throw error;
  }
};
