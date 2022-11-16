const Base = require("./base");
const logger = require("../common/logger")("outfit-bao");
const constants = require("../common/constants");
const { ClosetDao, UserDao, OutfitDao } = require("../dao");

class OutfitBao extends Base {
  constructor() {
    super();
  }

  async createOutfit(outfitData) {
    try {
      logger.info("inside createOutfit");
      let userDetails = await UserDao.findUserId(outfitData.userId);
      if (userDetails.length > 0) {
        if (outfitData.closetItemIds.length > 1) {
          let finalData = [];
          let whereObj = {
            userId: outfitData.userId,
            _id: { $in: outfitData.closetItemIds },
          };
          let closetDetails = await ClosetDao.findClosetDetails(whereObj);
          if (closetDetails.length > 0) {
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
              finalData.push(obj);
            });
          } else {
            return {
              statusCode: constants.STATUS_CODES[311],
              statusMessage: constants.STATUS_MESSAGE[311],
            };
          }

          let insertObj = {
            userId: outfitData.userId,
            closetItemIds: outfitData.closetItemIds,
          };
          let existingMatch = await OutfitDao.findSameOutfits(insertObj);
          if (existingMatch.length > 0) {
            return {
              statusCode: constants.STATUS_CODES[310],
              statusMessage: constants.STATUS_MESSAGE[310],
            };
          }
          let outfitDetails = await OutfitDao.saveOutfitDetails(insertObj);

          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            userId: outfitData.userId,
            outfitId: outfitDetails._id,
            finalData,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[309],
            statusMessage: constants.STATUS_MESSAGE[309],
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

  async removeOutfitItem(userId, outfitId) {
    try {
      logger.info("inside removeOutfitItem");
      let userDetails = await UserDao.findUserId(userId);
      if (userDetails.length > 0) {
        let whereObj = {
          userId,
          _id: outfitId,
        };
        let outfitData = await OutfitDao.findSameOutfits(whereObj);
        if (outfitData.length > 0) {
          await OutfitDao.deleteOutfitItem(whereObj);
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

  async findOutfitList(userId, closetItemId) {
    try {
      logger.info("inside findOutfitList");
      let userDetails = await UserDao.findUserId(userId);
      if (userDetails.length > 0) {
        let closetDetails = await ClosetDao.findClosetId(closetItemId);
        if (closetDetails.length > 0) {
          let whereObj = {
            userId,
            closetItemIds: { $all: [closetItemId] },
          };
          let outfitDetails = await OutfitDao.findSameOutfits(whereObj);
          let finalOutfitDetails = [];
          await Promise.all(
            outfitDetails.map(async (element) => {
              let closetDetailsList = [];
              await Promise.all(
                element.closetItemIds.map(async (element) => {
                  let closetDetails = await ClosetDao.findClosetId(element);
                  let obj = {
                    userId: closetDetails[0].userId,
                    closetItemId: closetDetails[0]._id,
                    itemImageUrl: closetDetails[0].itemImageUrl,
                    categoryId: closetDetails[0].categoryId,
                    categoryName: closetDetails[0].categoryName,
                    subCategoryId: closetDetails[0].subCategoryId,
                    subCategoryName: closetDetails[0].subCategoryName,
                    brandId: closetDetails[0].brandId,
                    brandName: closetDetails[0].brandName,
                    season: closetDetails[0].season,
                    colorCode: closetDetails[0].colorCode,
                  };
                  closetDetailsList.push(obj);
                })
              );
              let obj = {
                outfitId: element._id,
                userId: element.userId,
                closetDetailsList,
              };
              finalOutfitDetails.push(obj);
            })
          );
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            outfitList: finalOutfitDetails,
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

module.exports = OutfitBao;
