const Base = require("./base");
const logger = require("../common/logger")("pics-bao");
const constants = require("../common/constants");
const fs = require("fs");

const {
  RemoveBgResult,
  RemoveBgError,
  removeBackgroundFromImageFile,
} = require("remove.bg");

class PicsBao extends Base {
  constructor() {
    super();
  }

  async removeBgFromImg(req) {
    try {
      logger.info("inside removeBgFromImg");
      let url;
      logger.info("URL:", url);
      fs.unlinkSync(req.file.path);
      return {
        statusCode: constants.STATUS_CODES[200],
        statusMessage: constants.STATUS_MESSAGE[200],
        url,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = PicsBao;
