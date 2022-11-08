const { Categories } = require("../models");

module.exports.getCategories = async () => {
  try {
    const data = await Categories.find({});
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
