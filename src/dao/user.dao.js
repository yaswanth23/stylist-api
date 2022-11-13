const { User } = require("../models");

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
