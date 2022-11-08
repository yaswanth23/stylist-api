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
