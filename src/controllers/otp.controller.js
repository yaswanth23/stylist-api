const Joi = require("joi");
const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("otp-controller");
const { validateSchema } = require("../common/validator");
const { OtpBao } = require("../bao");

module.exports.POST_sendOtp = async (req, res) => {
  try {
    logger.info("inside POST_sendOtp");
    const schemaSendOtp = Joi.object().keys({
      emailId: Joi.string().required(),
      status: Joi.number().min(1).max(2).required(),
    });
    let params = await validateSchema(req.body, schemaSendOtp);
    const otpBao = new OtpBao();
    const result = await otpBao.sendOtp(params.emailId, params.status);
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_verifyOtp = async (req, res) => {
  try {
    logger.info("inside POST_verifyOtp");
    const schemaVerifyOtp = Joi.object().keys({
      emailId: Joi.string().required(),
      otp: Joi.number().required(),
      status: Joi.number().min(1).max(2).required(),
    });
    let params = await validateSchema(req.body, schemaVerifyOtp);
    const otpBao = new OtpBao();
    const result = await otpBao.verifyOtp(
      params.emailId,
      params.otp,
      params.status
    );
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
