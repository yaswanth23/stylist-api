const Joi = require("joi");
const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("admin-controller");
const { validateSchema } = require("../common/validator");
const { HomeBao } = require("../bao");

module.exports.GET_allProducts = async (req, res) => {
  try {
    logger.info("inside GET_allProducts");
    const schemaVerifyFilters = Joi.object().keys({
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      sortBy: Joi.string().valid("lowPrice", "highPrice", "latest").optional(),
      categoryIds: Joi.string().optional(),
      subCategoryIds: Joi.string().optional(),
      brandIds: Joi.string().optional(),
      season: Joi.string().optional(),
      color: Joi.string().optional(),
      size: Joi.string().optional(),
      price: Joi.string().optional(),
    });
    const { page = 1, limit = 100 } = req.query;
    let params = await validateSchema(req.query, schemaVerifyFilters);
    const homeBao = new HomeBao();
    const result = await homeBao.getAllProducts(page, limit, params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_productDetails = async (req, res) => {
  try {
    logger.info("inside GET_productDetails");
    const schemaVerify = Joi.object().keys({
      productId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaVerify);
    const homeBao = new HomeBao();
    const result = await homeBao.getProductDetails(params.productId);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_preferences = async (req, res) => {
  try {
    logger.info("inside GET_preferences");
    const homeBao = new HomeBao();
    const result = await homeBao.getPreferences();
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_homePageData = async (req, res) => {
  try {
    logger.info("inside GET_homePageData");
    const homeBao = new HomeBao();
    const result = await homeBao.getHomePageData();
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
