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

module.exports.getClosetDetails = async (userId) => {
  try {
    const data = await Closet.find({ userId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findClosetId = async (closetId) => {
  try {
    const data = await Closet.find({ _id: closetId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.deleteClosetItem = async (whereObj) => {
  try {
    const data = await Closet.deleteOne(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
