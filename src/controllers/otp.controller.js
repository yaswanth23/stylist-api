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
    });
    let params = await validateSchema(req.body, schemaSendOtp);
    const otpBao = new OtpBao();
    const result = await otpBao.sendOtp(params.emailId);
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
    });
    let params = await validateSchema(req.body, schemaVerifyOtp);
    const otpBao = new OtpBao();
    const result = await otpBao.verifyOtp(params.emailId, params.otp);
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
