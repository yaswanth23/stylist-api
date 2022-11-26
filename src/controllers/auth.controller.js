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
    const result = await authBao.login(
      params.emailId.toLowerCase(),
      params.status
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_deleteAccount = async (req, res) => {
  try {
    logger.info("inside POST_deleteAccount");
    const schemaVerifyUserId = Joi.object().keys({
      userId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyUserId);
    const authBao = new AuthBao();
    const result = await authBao.deleteAccount(params.userId);
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_googleLogin = async (req, res) => {
  try {
    logger.info("inside POST_googleLogin");
    const schemaVerifyDetails = Joi.object().keys({
      idToken: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const authBao = new AuthBao();
    const result = await authBao.googleLogin(params.idToken);
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_instaLogin = async (req, res) => {
  try {
    logger.info("inside POST_instaLogin");
    const schemaVerifyDetails = Joi.object().keys({
      access_token: Joi.string().required(),
      user_id: Joi.number().unsafe().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const authBao = new AuthBao();
    const result = await authBao.instaLogin(
      params.access_token,
      params.user_id
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    console.log(e);
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_appleLogin = async (req, res) => {
  try {
    logger.info("inside POST_appleLogin");
    const schemaVerifyDetails = Joi.object().keys({
      identityToken: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const authBao = new AuthBao();
    const result = await authBao.appleLogin(params.identityToken);
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    console.log(e);
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_verifyUser = async (req, res) => {
  try {
    logger.info("inside GET_verifyUser");
    const schemaVerifyDetails = Joi.object().keys({
      emailId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaVerifyDetails);
    const authBao = new AuthBao();
    const result = await authBao.verifyUser(params.emailId.toLowerCase());
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
