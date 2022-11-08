const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("pics-controller");
const { PicsBao } = require("../bao");

module.exports.POST_removeBgFromImg = async (req, res) => {
  try {
    logger.info("inside POST_removeBgFromImg");
    const picsBao = new PicsBao();
    const result = await picsBao.removeBgFromImg(req);
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
