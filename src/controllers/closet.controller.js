const { _200, _error } = require("../common/httpHelper");
const Joi = require("joi");
const logger = require("../common/logger")("closet-controller");
const { validateSchema } = require("../common/validator");
const { ClosetBao } = require("../bao");

module.exports.GET_getCategories = async (req, res) => {
  try {
    logger.info("inside GET_getCategories");
    const closetBao = new ClosetBao();
    const result = await closetBao.getCategories();
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_getBrands = async (req, res) => {
  try {
    logger.info("inside GET_getBrands");
    const closetBao = new ClosetBao();
    const result = await closetBao.getBrands();
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_addToCloset = async (req, res) => {
  try {
    logger.info("inside POST_addToCloset");
    const schemaVerifyAddToCloset = Joi.object().keys({
      userId: Joi.string().required(),
      itemImageUrl: Joi.string().required(),
      categoryId: Joi.number().required(),
      subCategoryId: Joi.number().required(),
      brandId: Joi.number().required(),
      season: Joi.string().required(),
      colorCode: Joi.string().min(7).max(7).required(),
    });
    let params = await validateSchema(req.body, schemaVerifyAddToCloset);
    const closetBao = new ClosetBao();
    const result = await closetBao.addToCloset(params);
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_getClosetDetails = async (req, res) => {
  try {
    logger.info("inside GET_getClosetDetails");
    const schemaVerifyUserId = Joi.object().keys({
      userId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaVerifyUserId);
    const closetBao = new ClosetBao();
    const result = await closetBao.getClosetDetails(params.userId);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_removeClosetItem = async (req, res) => {
  try {
    logger.info("inside POST_removeClosetItem");
    const schemaVerifyDetails = Joi.object().keys({
      userId: Joi.string().required(),
      closetItemId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const closetBao = new ClosetBao();
    const result = await closetBao.removeClosetItem(
      params.userId,
      params.closetItemId
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_getOneClosetDetails = async (req, res) => {
  try {
    logger.info("inside POST_getOneClosetDetails");
    const schemaVerifyDetails = Joi.object().keys({
      userId: Joi.string().required(),
      closetItemId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const closetBao = new ClosetBao();
    const result = await closetBao.getOneClosetDetails(
      params.userId,
      params.closetItemId
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
