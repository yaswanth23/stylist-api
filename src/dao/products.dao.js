const { Products } = require("../models");
const logger = require("../common/logger")("products-dao");

module.exports.saveProductDetails = async (insertObj) => {
  try {
    const data = new Products(insertObj);
    data.save();
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.deleteProductData = async (whereObj) => {
  try {
    const data = await Products.deleteMany(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getProductDetails = async (brandId) => {
  try {
    const data = await Products.find({ brandId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getAllProductDetails = async () => {
  try {
    const data = await Products.find({});
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getAllProductData = async (page, limit) => {
  try {
    const data = await Products.find({ productStatus: "published" })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findProduct = async (productId) => {
  try {
    const data = await Products.find({
      _id: productId,
    });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateProductStatus = async (brandId) => {
  try {
    let whereObj = { brandId: brandId };
    let updateObj = {
      $set: {
        productStatus: "published",
        updatedOn: new Date().toISOString(),
      },
    };
    const data = await Products.updateMany(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateProductDetails = async (productId, updateObj) => {
  try {
    let whereObj = { _id: productId };
    const data = await Products.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getBrandProductsCount = async (brandId) => {
  try {
    const count = await Products.countDocuments({ brandId });
    return count;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
