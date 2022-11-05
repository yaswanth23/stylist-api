const Base = require("./base");
const logger = require("../common/logger")("user-bao");
const constants = require("../common/constants");
const { UserDao } = require("../dao");

class UserBao extends Base {
  constructor() {
    super();
  }

  async getUserDetails(userId) {
    try {
      logger.info("inside getUserDetails", userId);
      let userDetails = await UserDao.findUserId(userId);
      let res;
      if (userDetails.length > 0) {
        res = {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: userDetails[0].userId,
          emailId: userDetails[0].emailId,
          isVerified: userDetails[0].isVerified,
        };
      } else {
        res = {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
      return res;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = UserBao;
