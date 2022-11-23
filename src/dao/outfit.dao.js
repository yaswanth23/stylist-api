const { Outfit } = require("../models");
const logger = require("../common/logger")("outfit-dao");

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

module.exports.removeClosetItems = async (obj) => {
  try {
    const data = await Outfit.find({
      userId: obj.userId,
      closetItemIds: { $in: [obj._id] },
    });
    if (data.length > 0) {
      await Promise.all(
        data.map(async (element) => {
          let whereObj = { userId: element.userId, _id: element._id };
          await Outfit.deleteOne(whereObj);
        })
      );
    }
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateOutfitDetails = async (whereObj, updateObj) => {
  try {
    const data = await Outfit.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
