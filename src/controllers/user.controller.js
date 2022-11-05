const Joi = require("joi");
const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("user-controller");
const { validateSchema } = require("../common/validator");
const { UserBao } = require("../bao");

module.exports.GET_userDetails = async (req, res) => {
  try {
    logger.info("inside GET_userDetails");
    const schemaVerifyUserId = Joi.object().keys({
      userId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaVerifyUserId);
    const userBao = new UserBao();
    const result = await userBao.getUserDetails(params.userId);
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
