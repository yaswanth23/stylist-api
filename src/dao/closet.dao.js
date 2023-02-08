const { Categories, Brands, Colors, Closet } = require("../models");
const logger = require("../common/logger")("closet-dao");

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

module.exports.getColors = async () => {
  try {
    const data = await Colors.find({});
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

module.exports.deleteClosetItems = async (whereObj) => {
  try {
    const data = await Closet.deleteMany(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findByCategoryId = async (whereObj) => {
  try {
    const data = await Closet.find(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateClosetDetails = async (whereObj, updateObj) => {
  try {
    const data = await Closet.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findClosetDetails = async (whereObj) => {
  try {
    const data = await Closet.find(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
