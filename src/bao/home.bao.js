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
          categoryId: val.categoryId,
          categoryName: val.categoryName,
          subCategoryId: val.subCategoryId,
          subCategoryName: val.subCategoryName,
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

      if (filters.categoryIds) {
        let categories = JSON.parse(filters.categoryIds);
        if (categories.length > 0) {
          finalData = finalData.filter((data) =>
            categories.includes(data.categoryId)
          );
        }
      }

      if (filters.subCategoryIds) {
        let subCategories = JSON.parse(filters.subCategoryIds);
        if (subCategories.length > 0) {
          finalData = finalData.filter((data) =>
            subCategories.includes(data.subCategoryId)
          );
        }
      }

      // if (filters.brandIds) {
      //   let brands = JSON.parse(filters.brandIds);
      //   if (brands.length > 0) {
      //     finalData = finalData.filter((data) => brands.includes(data.brandId));
      //   }
      // }

      if (filters.season) {
        let seasonsList = JSON.parse(filters.season);
        if (seasonsList.length > 0) {
          finalData = finalData.filter((data) =>
            data.seasons.some((season) => seasonsList.includes(season))
          );
        }
      }

      if (filters.color) {
        let colors = JSON.parse(filters.color);
        finalData = finalData.filter((data) =>
          colors.includes(data.productColor)
        );
      }

      if (filters.size) {
        let sizes = JSON.parse(filters.size);
        if (sizes.length > 0) {
          finalData = finalData.filter((data) =>
            data.productSizes.some((size) => sizes.includes(size))
          );
        }
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
      logger.info("inside getProductDetails", productId);
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
            categoryId: productDetails[0].categoryId,
            categoryName: productDetails[0].categoryName,
            subCategoryId: productDetails[0].subCategoryId,
            subCategoryName: productDetails[0].subCategoryName,
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

  async getPreferences() {
    try {
      logger.info("inside getPreferences");
      return "aa";
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getHomePageData() {
    try {
      logger.info("inside getHomePageData");
      let productDetails = await ProductsDao.getAllProductData(1, 10);

      const transformedArray = productDetails.reduce((result, product) => {
        const existingCategory = result.find(
          (item) => item.categoryId === product.categoryId
        );
        if (existingCategory) {
          existingCategory.subCategory.push({
            subCategoryId: product.subCategoryId,
            subCategoryName: product.subCategoryName,
            subCategoryImage: product.imageUrls[0],
          });
        } else {
          result.push({
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            subCategory: [
              {
                subCategoryId: product.subCategoryId,
                subCategoryName: product.subCategoryName,
                subCategoryImage: product.imageUrls[0],
              },
            ],
          });
        }
        return result;
      }, []);

      return transformedArray;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = HomeBao;
