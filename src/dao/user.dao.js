const { User } = require("../models");
const logger = require("../common/logger")("user-dao");

module.exports.findUserId = async (userId) => {
  try {
    const data = await User.find({ userId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.saveUserDetails = async (insertObj) => {
  try {
    const data = new User(insertObj);
    data.save();
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findUserEmailId = async (emailId) => {
  try {
    const data = await User.find({ emailId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateUserProfilePic = async (userId, profilePicUrl) => {
  try {
    let whereObj = { userId };
    let updateObj = {
      $set: {
        profilePicUrl,
        isProfileCreated: true,
        updatedOn: new Date().toISOString(),
      },
    };
    const data = await User.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateUserProfileDetails = async (userId, profileDetails) => {
  try {
    let whereObj = { userId };
    let updateObj = {
      $set: {
        emailId: profileDetails.emailId,
        name: profileDetails.name,
        gender: profileDetails.gender.toLowerCase(),
        isProfileCreated: true,
        updatedOn: new Date().toISOString(),
      },
    };
    const data = await User.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.deleteUserAccount = async (whereObj) => {
  try {
    const data = await User.deleteMany(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findUserInstaId = async (instaId) => {
  try {
    const data = await User.find({ instaId });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getUserCount = async () => {
  try {
    const count = await User.countDocuments({});
    return count;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getAllUsers = async (page, limit) => {
  try {
    const data = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateUserLastActive = async (userId, updateObj) => {
  try {
    let whereObj = { userId };
    const data = await User.updateMany(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
