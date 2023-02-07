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
