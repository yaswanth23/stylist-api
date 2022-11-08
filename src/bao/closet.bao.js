const Base = require("./base");
const logger = require("../common/logger")("closet-bao");
const constants = require("../common/constants");
const { ClosetDao } = require("../dao");

class PicsBao extends Base {
  constructor() {
    super();
  }

  async getCategories() {
    try {
      logger.info("inside getCategories");
      let result = await ClosetDao.getCategories();
      return result;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = PicsBao;
