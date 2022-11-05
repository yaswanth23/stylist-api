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

module.exports.updateOtpDetails = async (emailId) => {
  try {
    let whereObj = { emailId };
    let updateObj = { $set: { isVerified: true } };
    const data = await User.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updateUserPasswordDetails = async (insertObj, userId) => {
  try {
    let whereObj = { userId };
    let updateObj = { $set: insertObj };
    const data = await User.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
