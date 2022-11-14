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

        let categoryName;
        let subCategoryName;
        let brandName;
        let subCategoryList;

        let categoryList = await ClosetDao.getCategories();
        let findCategoryId = (obj) => obj.categoryId == closetData.categoryId;
        if (!categoryList.some(findCategoryId)) {
          return {
            statusCode: constants.STATUS_CODES[305],
            statusMessage: constants.STATUS_MESSAGE[305],
          };
        }
        categoryList.map((element) => {
          if (element.categoryId == closetData.categoryId) {
            categoryName = element.categoryName;
            subCategoryList = element.subCategory;
          }
        });

        let findSubCategoryId = (obj) =>
          obj.subCategoryId == closetData.subCategoryId;
        if (!subCategoryList.some(findSubCategoryId)) {
          return {
            statusCode: constants.STATUS_CODES[306],
            statusMessage: constants.STATUS_MESSAGE[306],
          };
        }
        subCategoryList.map((element) => {
          if (element.subCategoryId == closetData.subCategoryId) {
            subCategoryName = element.subCategoryName;
          }
        });

        let brandList = await ClosetDao.getBrands();
        let findBrandId = (obj) => obj.brandId == closetData.brandId;
        if (!brandList.some(findBrandId)) {
          return {
            statusCode: constants.STATUS_CODES[307],
            statusMessage: constants.STATUS_MESSAGE[307],
          };
        }
        brandList.map((element) => {
          if (element.brandId == closetData.brandId) {
            brandName = element.brandName;
          }
        });

        const insertObj = {
          userId: closetData.userId,
          itemImageUrl: uploadFileResult.Location,
          categoryId: closetData.categoryId,
          categoryName,
          subCategoryId: closetData.subCategoryId,
          subCategoryName,
          brandId: closetData.brandId,
          brandName,
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
          categoryId: savedDetails.categoryId,
          categoryName: savedDetails.categoryName,
          subCategoryId: savedDetails.subCategoryId,
          subCategoryName: savedDetails.subCategoryName,
          brandId: savedDetails.brandId,
          brandName: savedDetails.brandName,
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
            categoryId: element.categoryId,
            categoryName: element.categoryName,
            subCategoryId: element.subCategoryId,
            subCategoryName: element.subCategoryName,
            brandId: element.brandId,
            brandName: element.brandName,
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

  async removeClosetItem(userId, closetId) {
    try {
      logger.info("inside removeClosetItem");
      let userDetails = await UserDao.findUserId(userId);
      if (userDetails.length > 0) {
        let closetDetails = await ClosetDao.findClosetId(closetId);
        if (closetDetails.length > 0) {
          let whereObj = {
            userId,
            _id: closetId,
          };
          await ClosetDao.deleteClosetItem(whereObj);
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: "item deleted successfully",
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[308],
            statusMessage: constants.STATUS_MESSAGE[308],
          };
        }
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
