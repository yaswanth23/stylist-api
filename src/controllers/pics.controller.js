const { _200, _error } = require("../common/httpHelper");
const Joi = require("joi");
const logger = require("../common/logger")("pics-controller");
const { validateSchema } = require("../common/validator");
const { PicsBao } = require("../bao");

module.exports.POST_removeBgFromImg = async (req, res) => {
  try {
    logger.info("inside POST_removeBgFromImg");
    const schemaVerifyDetails = Joi.object().keys({
      imageData: Joi.string().required(),
    });
    let params = await validateSchema(req.body, schemaVerifyDetails);
    const picsBao = new PicsBao();
    const result = await picsBao.removeBgFromImg(params.imageData);
    logger.info("success");
    return _200(res, result);
  } catch (e) {
    console.log(e);
    throw _sendGenericError(res, e);
  }
};

function _sendGenericError(res, e) {
  return _error(res, {
    message: e,
    type: "generic",
  });
}
