const { User, QuestionPref } = require("../models");
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
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          maleCount: {
            $sum: {
              $cond: { if: { $eq: ["$gender", "male"] }, then: 1, else: 0 },
            },
          },
          femaleCount: {
            $sum: {
              $cond: { if: { $eq: ["$gender", "female"] }, then: 1, else: 0 },
            },
          },
        },
      },
    ]);

    return {
      totalCount: result[0].count,
      maleCount: result[0].maleCount,
      femaleCount: result[0].femaleCount,
    };
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

module.exports.getQuestionPref = async () => {
  try {
    const data = await QuestionPref.find({});
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
