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
