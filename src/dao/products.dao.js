const { Products } = require("../models");

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

module.exports.updateProductStatus = async (productId) => {
  try {
    let whereObj = { productId };
    let updateObj = {
      $set: {
        productStatus: "published",
        updatedOn: new Date().toISOString(),
      },
    };
    const data = await Products.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateProductDetails = async (productId, updateObj) => {
  try {
    let whereObj = { productId };
    const data = await Products.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
