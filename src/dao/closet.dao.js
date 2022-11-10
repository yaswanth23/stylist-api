const { Categories, Brands } = require("../models");

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
