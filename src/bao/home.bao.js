const Base = require("./base");
const logger = require("../common/logger")("home-bao");
const constants = require("../common/constants");
const { ProductsDao } = require("../dao");

class HomeBao extends Base {
  constructor() {
    super();
  }
  async getAllProducts(page, limit, params) {
    try {
      logger.info("inside getAllProducts");
      delete params.page;
      delete params.limit;
      let filters = params;

      let allProducts = await ProductsDao.getAllProductData(page, limit);
      let finalData = [];
      let maxPrice = -Infinity;
      allProducts.forEach((val) => {
        let obj = {
          productId: val._id,
          productName: val.productName,
          productPrice: val.productPrice,
          productDescription: val.productDescription,
          productColor: val.productColor,
          imageUrls: val.imageUrls,
          productCategory: val.productCategory,
          seasons: val.seasons,
          productSizes: val.productSizes,
          productButtonLink: val.productButtonLink,
          createdOn: val.createdOn,
        };
        finalData.push(obj);
        if (val.productPrice > maxPrice) {
          maxPrice = val.productPrice;
        }
      });

      if (filters.sortBy) {
        if (filters.sortBy === "lowPrice") {
          finalData.sort((a, b) => {
            return a.productPrice - b.productPrice;
          });
        } else if (filters.sortBy === "highPrice") {
          finalData.sort((a, b) => {
            return b.productPrice - a.productPrice;
          });
        } else {
          finalData.sort((a, b) => {
            return new Date(b.createdOn) - new Date(a.createdOn);
          });
        }
      }

      if (filters.category) {
        let categories = JSON.parse(filters.category);
        finalData = finalData.filter((data) =>
          categories.includes(data.productCategory)
        );
      }

      //   if (filters.brand) {
      //     let brands = JSON.parse(filters.brand);
      //     finalData = finalData.filter((data) =>
      //       categories.includes(data.productCategory)
      //     );
      //   }

      if (filters.season) {
        let seasonsList = JSON.parse(filters.season);
        finalData = finalData.filter((data) =>
          data.seasons.some((season) => seasonsList.includes(season))
        );
      }

      if (filters.color) {
        let colors = JSON.parse(filters.color);
        finalData = finalData.filter((data) =>
          colors.includes(data.productColor)
        );
      }

      if (filters.size) {
        let sizes = JSON.parse(filters.size);
        finalData = finalData.filter((data) =>
          data.productSizes.some((size) => sizes.includes(size))
        );
      }

      if (filters.price) {
        let priceRange = JSON.parse(filters.price);
        if (priceRange.length === 2) {
          finalData = finalData.filter(
            (data) =>
              data.productPrice >= priceRange[0] &&
              data.productPrice <= priceRange[1]
          );
        }
      }

      return {
        statusCode: constants.STATUS_CODES[200],
        statusMessage: constants.STATUS_MESSAGE[200],
        total: finalData.length,
        minPrice: 0,
        maxPrice: 6000,
        productDetails: finalData,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getProductDetails(productId) {
    try {
      logger.info("inside getproductDetails", productId);
      let productDetails = await ProductsDao.findProduct(productId);
      if (productDetails.length > 0) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          productDetails: {
            productId: productDetails[0]._id,
            productName: productDetails[0].productName,
            productPrice: productDetails[0].productPrice,
            productDescription: productDetails[0].productDescription,
            productColor: productDetails[0].productColor,
            imageUrls: productDetails[0].imageUrls,
            productCategory: productDetails[0].productCategory,
            seasons: productDetails[0].seasons,
            productSizes: productDetails[0].productSizes,
            productButtonLink: productDetails[0].productButtonLink,
            createdOn: productDetails[0].createdOn,
          },
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: "product id not found",
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = HomeBao;
