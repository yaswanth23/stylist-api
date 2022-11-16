const { Outfit } = require("../models");

module.exports.saveOutfitDetails = async (insertObj) => {
  try {
    const data = new Outfit(insertObj);
    data.save();
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findSameOutfits = async (whereObj) => {
  try {
    const data = await Outfit.find(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.deleteOutfitItem = async (whereObj) => {
  try {
    const data = await Outfit.deleteOne(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findOutfitByUserId = async (userId) => {
  try {
    const data = await Outfit.find({ userId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
