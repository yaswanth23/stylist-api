const Joi = require("joi");
const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("admin-controller");
const { validateSchema } = require("../common/validator");
const { AdminBao } = require("../bao");

module.exports.POST_adminLogin = async (req, res) => {
  try {
    logger.info("inside POST_adminLogin");
    const schemaLogin = Joi.object().keys({
      emailId: Joi.string().required(),
      password: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaLogin);
    const adminBao = new AdminBao();
    const result = await adminBao.adminLogin(
      params.emailId.toLowerCase(),
      params.password
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_forgetPassword = async (req, res) => {
  try {
    logger.info("inside POST_forgetPassword");
    const schemaForgetPassword = Joi.object().keys({
      emailId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaForgetPassword);
    const adminBao = new AdminBao();
    const result = await adminBao.forgetPassword(params.emailId.toLowerCase());
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_changePassword = async (req, res) => {
  try {
    logger.info("inside POST_changePassword");
    const schemaChangePassword = Joi.object().keys({
      emailId: Joi.string().required(),
      currentPassword: Joi.string().min(7).required(),
      newPassword: Joi.string().min(7).required(),
    });
    let params = await validateSchema(req.body, schemaChangePassword);
    const adminBao = new AdminBao();
    const result = await adminBao.changePassword(
      params.emailId.toLowerCase(),
      params.currentPassword,
      params.newPassword
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_adminStats = async (req, res) => {
  try {
    logger.info("inside POST_adminStats");
    const schemaCheckEmailId = Joi.object().keys({
      emailId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaCheckEmailId);
    const adminBao = new AdminBao();
    const result = await adminBao.adminStats(params.emailId.toLowerCase());
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
