const { Categories, Brands, Closet } = require("../models");

module.exports.getCategories = async () => {
  try {
    const data = await Categories.find({});
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getBrands = async () => {
  try {
    const data = await Brands.find({});
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.saveClosetDetails = async (insertObj) => {
  try {
    const data = new Closet(insertObj);
    data.save();
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
