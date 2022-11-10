const { _200, _error } = require("../common/httpHelper");
const logger = require("../common/logger")("closet-controller");
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

function _sendGenericError(res, e) {
  return _error(res, {
    message: e,
    type: "generic",
  });
}
