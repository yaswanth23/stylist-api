const { Categories, Brands, Colors, Closet, Sizes } = require("../models");
const logger = require("../common/logger")("closet-dao");

module.exports.getCategories = async () => {
  try {
    const data = await Categories.find({});
    data.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
    data.forEach((category) => {
      category.subCategory.sort((a, b) =>
        a.subCategoryName.localeCompare(b.subCategoryName)
      );
    });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getBrands = async () => {
  try {
    const data = await Brands.find({});
    return data.sort((a, b) => a.brandName.localeCompare(b.brandName));
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getColors = async () => {
  try {
    const data = await Colors.find({});
    return data.sort((a, b) => a.colorName.localeCompare(b.colorName));
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getSizes = async () => {
  try {
    const data = await Sizes.find({});
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

module.exports.getClosetItemsCount = async (userId) => {
  try {
    const count = await Closet.countDocuments({ userId });
    const categoryStat = await Closet.aggregate([
      { $match: { userId } },
      { $group: { _id: "$categoryName", count: { $sum: 1 } } },
    ]);
    let categoryStats = categoryStat.map(({ _id, count }) => ({
      [_id]: count,
    }));

    const brandStat = await Closet.aggregate([
      { $match: { userId } },
      { $group: { _id: "$brandName", count: { $sum: 1 } } },
    ]);
    let brandStats = brandStat.map(({ _id, count }) => ({
      [_id]: count,
    }));

    const seasonStat = await Closet.aggregate([
      { $match: { userId } },
      { $unwind: "$season" },
      { $group: { _id: "$season", count: { $sum: 1 } } },
    ]);

    let seasonStats = seasonStat.map(({ _id, count }) => ({
      [_id]: count,
    }));

    const colorStat = await Closet.aggregate([
      { $match: { userId } },
      { $unwind: "$colorCode" },
      { $group: { _id: "$colorCode", count: { $sum: 1 } } },
    ]);

    let colorStats = colorStat.map(({ _id, count }) => ({
      [_id]: count,
    }));

    return {
      count,
      categoryStats: categoryStats,
      brandStats: brandStats,
      seasonStats: seasonStats,
      colorStats: colorStats,
    };
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
