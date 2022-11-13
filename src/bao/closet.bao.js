const Base = require("./base");
const logger = require("../common/logger")("closet-bao");
const constants = require("../common/constants");
const { ClosetDao, UserDao } = require("../dao");
const { S3Service } = require("../services");
class ClosetBao extends Base {
  constructor() {
    super();
  }

  async getCategories() {
    try {
      logger.info("inside getCategories");
      let result = await ClosetDao.getCategories();
      return {
        statusCode: constants.STATUS_CODES[200],
        statusMessage: constants.STATUS_MESSAGE[200],
        data: result,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getBrands() {
    try {
      logger.info("inside getBrands");
      let result = await ClosetDao.getBrands();
      return {
        statusCode: constants.STATUS_CODES[200],
        statusMessage: constants.STATUS_MESSAGE[200],
        data: result,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async addToCloset(closetData) {
    try {
      logger.info("inside addToCloset");
      let userDetails = await UserDao.findUserId(closetData.userId);
      if (userDetails.length > 0) {
        let base64Data = closetData.itemImageUrl.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/
        );
        if (base64Data.length !== 3) {
          return {
            statusCode: constants.STATUS_CODES[304],
            statusMessage: constants.STATUS_MESSAGE[304],
          };
        }
        const uploadFileResult = await S3Service.uploadClosetPicToS3(
          base64Data
        );
        const insertObj = {
          userId: closetData.userId,
          itemImageUrl: uploadFileResult.Location,
          category: closetData.category.toLowerCase(),
          brand: closetData.brand.toLowerCase(),
          season: closetData.season.toLowerCase(),
          colorCode: closetData.colorCode.toLowerCase(),
          createdOn: new Date().toISOString(),
        };
        const savedDetails = await ClosetDao.saveClosetDetails(insertObj);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: savedDetails.userId,
          closetItemId: savedDetails._id,
          itemImageUrl: savedDetails.itemImageUrl,
          category: savedDetails.category,
          brand: savedDetails.brand,
          season: savedDetails.season,
          colorCode: savedDetails.colorCode,
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getClosetDetails(userId) {
    try {
      logger.info("inside getClosetDetails");
      let userDetails = await UserDao.findUserId(userId);
      if (userDetails.length > 0) {
        const closetDetails = await ClosetDao.getClosetDetails(userId);
        let data = [];
        closetDetails.map((element) => {
          let obj = {
            userId: element.userId,
            closetItemId: element._id,
            itemImageUrl: element.itemImageUrl,
            category: element.category,
            brand: element.brand,
            season: element.season,
            colorCode: element.colorCode,
          };
          data.push(obj);
        });
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data,
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = ClosetBao;
