const Joi = require("joi");

function validateFunding(amount) {
  const schema = Joi.object({
    amount: Joi.number().precision(2).min(1).required(),
    account_number: Joi.number().min(1).required(),
  });
  return schema.validate(amount);
}

function validateTransfer(transferData) {
  const schema = Joi.object({
    account_number: Joi.number().min(10000000).required().messages({
        'number.min': `"account_number" should have a minimum length of 8`,
      }),
    amount: Joi.number().precision(2).min(1).required(),
    remark: Joi.string().min(1)
  });
  return schema.validate(transferData);
}

module.exports = { validateFunding, validateTransfer };
