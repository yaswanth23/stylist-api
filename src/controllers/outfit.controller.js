const { _200, _error } = require("../common/httpHelper");
const Joi = require("joi");
const logger = require("../common/logger")("closet-controller");
const { validateSchema } = require("../common/validator");
const { OutfitBao } = require("../bao");

module.exports.POST_createOutfit = async (req, res) => {
  try {
    logger.info("inside POST_createOutfit");
    const schemaVerifyCreateOutfit = Joi.object().keys({
      userId: Joi.string().required(),
      closetItemIds: Joi.array().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyCreateOutfit);
    const outfitBao = new OutfitBao();
    const result = await outfitBao.createOutfit(params);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_removeOutfitItem = async (req, res) => {
  try {
    logger.info("inside POST_removeOutfitItem");
    const schemaVerifyDetails = Joi.object().keys({
      userId: Joi.string().required(),
      outfitId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const outfitBao = new OutfitBao();
    const result = await outfitBao.removeOutfitItem(
      params.userId,
      params.outfitId
    );
    logger.info("result", result);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_findOutfitList = async (req, res) => {
  try {
    logger.info("inside POST_removeOutfitItem");
    const schemaVerifyDetails = Joi.object().keys({
      userId: Joi.string().required(),
      closetItemId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const outfitBao = new OutfitBao();
    const result = await outfitBao.findOutfitList(
      params.userId,
      params.closetItemId
    );
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.GET_getOutfitDetails = async (req, res) => {
  try {
    logger.info("inside GET_getOutfitDetails");
    const schemaVerifyUserId = Joi.object().keys({
      userId: Joi.string().required(),
    });
    let params = await validateSchema(req.query, schemaVerifyUserId);
    const outfitBao = new OutfitBao();
    const result = await outfitBao.getOutfitDetails(params.userId);
    return _200(res, result);
  } catch (e) {
    throw _sendGenericError(res, e);
  }
};

module.exports.POST_getOneOutfitDetails = async (req, res) => {
  try {
    logger.info("inside POST_getOneOutfitDetails");
    const schemaVerifyUserId = Joi.object().keys({
      userId: Joi.string().required(),
      outfitId: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyUserId);
    const outfitBao = new OutfitBao();
    const result = await outfitBao.getOneOutfitDetails(
      params.userId,
      params.outfitId
    );
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
