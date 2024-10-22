const Base = require("./base");
const logger = require("../common/logger")("closet-bao");
const constants = require("../common/constants");
const { ClosetDao, UserDao, OutfitDao } = require("../dao");
const { S3Service } = require("../services");
const cache = require("memory-cache");
class ClosetBao extends Base {
  constructor() {
    super();
  }

  async getCategories() {
    try {
      logger.info("inside getCategories");
      let cacheKey = "categories";
      let cachedData = cache.get(cacheKey);
      if (cachedData) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: cachedData,
        };
      } else {
        let result = await ClosetDao.getCategories();
        cache.put(cacheKey, result, 24 * 60 * 60 * 1000);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: result,
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getBrands() {
    try {
      logger.info("inside getBrands");
      let cacheKey = "brands";
      let cachedData = cache.get(cacheKey);
      if (cachedData) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: cachedData,
        };
      } else {
        let result = await ClosetDao.getBrands();
        cache.put(cacheKey, result, 24 * 60 * 60 * 1000);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: result,
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getColors() {
    try {
      logger.info("inside getColors");
      let cacheKey = "colors";
      let cachedData = cache.get(cacheKey);
      if (cachedData) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: cachedData,
        };
      } else {
        let result = await ClosetDao.getColors();
        cache.put(cacheKey, result, 24 * 60 * 60 * 1000);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: result,
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getSizes() {
    try {
      logger.info("inside getSizes");
      let cacheKey = "sizes";
      let cachedData = cache.get(cacheKey);
      if (cachedData) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: cachedData,
        };
      } else {
        let result = await ClosetDao.getSizes();
        cache.put(cacheKey, result, 24 * 60 * 60 * 1000);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          data: result,
        };
      }
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
        if (base64Data.length !== 3 || base64Data == null) {
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
          season: closetData.season.map(function (x) {
            return x.toLowerCase();
          }),
          colorCode: closetData.colorCode.map(function (x) {
            return x.toLowerCase();
          }),
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
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
      console.log(e);
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
          await OutfitDao.removeClosetItems(whereObj);
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

  async getOneClosetDetails(userId, closetId) {
    try {
      logger.info("inside getOneClosetDetails");
      let userDetails = await UserDao.findUserId(userId);
      if (userDetails.length > 0) {
        let closetDetails = await ClosetDao.findClosetId(closetId);
        if (closetDetails.length > 0) {
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
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

  async filterCloset(params) {
    try {
      logger.info("inside filterCloset");
      let userDetails = await UserDao.findUserId(params.userId);
      if (userDetails.length > 0) {
        let categoryIds = params.categoryIds;
        let subCategoryIds = params.subCategoryIds;
        let brandIds = params.brandIds;
        let seasons = params.seasons.map(function (x) {
          return x.toLowerCase();
        });
        let colorCodes = params.colorCodes.map(function (x) {
          return x.toLowerCase();
        });

        let filterData = [];
        let whereObj = {
          userId: params.userId,
          categoryId: categoryIds.length > 0 ? { $in: categoryIds } : "",
          subCategoryId:
            subCategoryIds.length > 0 ? { $in: subCategoryIds } : "",
          brandId: brandIds.length > 0 ? { $in: brandIds } : "",
          season: seasons.length > 0 ? { $in: seasons } : "",
        };
        let finalObj = JSON.parse(JSON.stringify(whereObj), (key, value) =>
          value === null || value === "" ? undefined : value
        );

        let data = await ClosetDao.findByCategoryId(finalObj);
        if (colorCodes.length > 0) {
          data.map((element) => {
            let matchingColorCodes = colorCodes.filter(
              (e) => element.colorCode.indexOf(e) !== -1
            );
            if (matchingColorCodes.length > 0) {
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
              filterData.push(obj);
            }
          });
        } else {
          data.map((element) => {
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
            filterData.push(obj);
          });
        }
        console.log("filterData length", filterData.length);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          filterData,
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

  async editClosetDetails(closetData) {
    try {
      logger.info("inside editClosetDetails");
      let userDetails = await UserDao.findUserId(closetData.userId);
      if (userDetails.length > 0) {
        let closetDetails = await ClosetDao.findClosetId(
          closetData.closetItemId
        );
        if (closetDetails.length > 0) {
          let whereObj = {
            _id: closetData.closetItemId,
            userId: closetData.userId,
          };
          let updateObj;

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

          if (closetData.categoryId != closetDetails.categoryId) {
            updateObj = {
              categoryId: closetData.categoryId,
              categoryName,
              updatedOn: new Date().toISOString(),
            };
            await ClosetDao.updateClosetDetails(whereObj, updateObj);
          }

          if (closetData.subCategoryId != closetDetails.subCategoryId) {
            updateObj = {
              subCategoryId: closetData.subCategoryId,
              subCategoryName,
              updatedOn: new Date().toISOString(),
            };
            await ClosetDao.updateClosetDetails(whereObj, updateObj);
          }

          if (closetData.brandId != closetDetails.brandId) {
            updateObj = {
              brandId: closetData.brandId,
              brandName,
              updatedOn: new Date().toISOString(),
            };
            await ClosetDao.updateClosetDetails(whereObj, updateObj);
          }

          updateObj = {
            season: closetData.season.map(function (x) {
              return x.toLowerCase();
            }),
            colorCode: closetData.colorCode.map(function (x) {
              return x.toLowerCase();
            }),
            updatedOn: new Date().toISOString(),
          };
          await ClosetDao.updateClosetDetails(whereObj, updateObj);

          let urlFlag =
            String(closetData.itemImageUrl).valueOf() !=
            String(closetDetails.itemImageUrl).valueOf();
          if (!urlFlag) {
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

            updateObj = {
              itemImageUrl: uploadFileResult.Location,
              updatedOn: new Date().toISOString(),
            };
            await ClosetDao.updateClosetDetails(whereObj, updateObj);
          }

          let finalClosetDetails = await ClosetDao.findClosetId(
            closetData.closetItemId
          );
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            userId: finalClosetDetails[0].userId,
            closetItemId: finalClosetDetails[0]._id,
            itemImageUrl: finalClosetDetails[0].itemImageUrl,
            categoryId: finalClosetDetails[0].categoryId,
            categoryName: finalClosetDetails[0].categoryName,
            subCategoryId: finalClosetDetails[0].subCategoryId,
            subCategoryName: finalClosetDetails[0].subCategoryName,
            brandId: finalClosetDetails[0].brandId,
            brandName: finalClosetDetails[0].brandName,
            season: finalClosetDetails[0].season,
            colorCode: finalClosetDetails[0].colorCode,
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
