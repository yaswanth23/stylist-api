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

module.exports.GET_adminStats = async (req, res) => {
  try {
    logger.info("inside GET_adminStats");
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

module.exports.GET_allUsers = async (req, res) => {
  try {
    logger.info("inside GET_allUsers");
    const schemaCheckEmailId = Joi.object().keys({
      emailId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const { page = 1, limit = 10 } = req.query;
    let params = await validateSchema(req.query, schemaCheckEmailId);
    const adminBao = new AdminBao();
    const result = await adminBao.getAllUsers(
      params.emailId.toLowerCase(),
      page,
      limit
    );
    logger.info("success");
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_addBrandUser = async (req, res) => {
  try {
    logger.info("inside POST_addBrandUser");
    const schemaCheckEmailId = Joi.object().keys({
      adminEmailId: Joi.string().required(),
      brandEmailId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaCheckEmailId);
    const adminBao = new AdminBao();
    const result = await adminBao.addBrandUser(
      params.adminEmailId.toLowerCase(),
      params.brandEmailId.toLowerCase()
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_allBrands = async (req, res) => {
  try {
    logger.info("inside GET_allBrands");
    const schemaCheckEmailId = Joi.object().keys({
      emailId: Joi.string().required(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    });
    const { page = 1, limit = 10 } = req.query;
    let params = await validateSchema(req.query, schemaCheckEmailId);
    const adminBao = new AdminBao();
    const result = await adminBao.getAllBrands(
      params.emailId.toLowerCase(),
      page,
      limit
    );
    logger.info("success");
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_deleteUsers = async (req, res) => {
  try {
    logger.info("inside POST_deleteUsers");
    const schemaVerifyData = Joi.object().keys({
      adminUserId: Joi.string().required(),
      userIds: Joi.array().items(Joi.string().required()),
    });
    let params = await validateSchema(req.body, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.deleteUserAccounts(
      params.adminUserId,
      params.userIds
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_userDetails = async (req, res) => {
  try {
    logger.info("inside GET_userDetails");
    const schemaVerifyData = Joi.object().keys({
      adminUserId: Joi.string().required(),
      userId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.getUserDetails(
      params.adminUserId,
      params.userId
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_addNewUser = async (req, res) => {
  try {
    logger.info("inside POST_addNewUser");
    const schemaVerifyData = Joi.object().keys({
      adminUserId: Joi.string().required(),
      name: Joi.string().required(),
      emailId: Joi.string().required(),
      gender: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.addNewUser(
      params.adminUserId,
      params.name,
      params.emailId.toLowerCase(),
      params.gender.toLowerCase()
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_removeUserClosetItem = async (req, res) => {
  try {
    logger.info("inside POST_removeUserClosetItem");
    const schemaVerifyDetails = Joi.object().keys({
      adminUserId: Joi.string().required(),
      userId: Joi.string().required(),
      closetItemId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const adminBao = new AdminBao();
    const result = await adminBao.removeUserClosetItem(
      params.adminUserId,
      params.userId,
      params.closetItemId
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_removeUserOutfitItem = async (req, res) => {
  try {
    logger.info("inside POST_removeUserOutfitItem");
    const schemaVerifyDetails = Joi.object().keys({
      adminUserId: Joi.string().required(),
      userId: Joi.string().required(),
      outfitId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const adminBao = new AdminBao();
    const result = await adminBao.removeUserOutfitItem(
      params.adminUserId,
      params.userId,
      params.outfitId
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_deleteBrands = async (req, res) => {
  try {
    logger.info("inside POST_deleteBrands");
    const schemaVerifyData = Joi.object().keys({
      adminUserId: Joi.string().required(),
      brandIds: Joi.array().items(Joi.string().required()),
    });
    let params = await validateSchema(req.body, schemaVerifyData);
    const adminBao = new AdminBao();
    const result = await adminBao.deleteBrandAccounts(
      params.adminUserId,
      params.brandIds
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
