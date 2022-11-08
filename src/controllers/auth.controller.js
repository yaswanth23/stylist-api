const Joi = require("joi");
const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("auth-controller");
const { validateSchema } = require("../common/validator");
const { AuthBao } = require("../bao");

module.exports.POST_login = async (req, res) => {
  try {
    logger.info("inside POST_login");
    const schemaLogin = Joi.object().keys({
      emailId: Joi.string().required(),
      status: Joi.number().min(1).max(1).required(),
    });
    let params = await validateSchema(req.body, schemaLogin);
    const authBao = new AuthBao();
    const result = await authBao.login(params.emailId, params.status);
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

function _sendGenericError(res, e) {
  return _error(res, {
    message: e,
    type: "generic",
  });
}
