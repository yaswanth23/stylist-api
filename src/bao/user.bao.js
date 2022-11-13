const Base = require("./base");
const logger = require("../common/logger")("user-bao");
const constants = require("../common/constants");
const { UserDao } = require("../dao");
const fs = require("fs");
const { S3Service } = require("../services");
class UserBao extends Base {
  constructor() {
    super();
  }

  async getUserDetails(userId) {
    try {
      logger.info("inside getUserDetails", userId);
      let userDetails = await UserDao.findUserId(userId);
      let res;
      if (userDetails.length > 0) {
        res = {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: userDetails[0].userId,
          emailId: userDetails[0].emailId,
          name: userDetails[0].name == undefined ? null : userDetails[0].name,
          gender:
            userDetails[0].gender == undefined ? null : userDetails[0].gender,
          profilePicUrl:
            userDetails[0].profilePicUrl == undefined
              ? null
              : userDetails[0].profilePicUrl,
          isProfileCreated: userDetails[0].isProfileCreated,
        };
      } else {
        res = {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
      return res;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async postUserProfile(fileData, userData) {
    try {
      logger.info("inside postUserProfile", userData.userId);
      let userDetails = await UserDao.findUserId(userData.userId);
      if (userDetails.length > 0) {
        if (fileData != undefined) {
          const uploadFileResult = await S3Service.uploadProfilePicToS3(
            fileData
          );
          await UserDao.updateUserProfilePic(
            userData.userId,
            uploadFileResult.Location
          );
          fs.unlinkSync(fileData.path);
        }
        await UserDao.updateUserProfileDetails(userData.userId, userData);
        const updatedUserProfileData = await UserDao.findUserId(
          userData.userId
        );
        return {
          userId: updatedUserProfileData[0].userId,
          emailId: updatedUserProfileData[0].emailId,
          name: updatedUserProfileData[0].name,
          gender: updatedUserProfileData[0].gender,
          profilePicUrl: updatedUserProfileData[0].profilePicUrl,
          isProfileCreated: updatedUserProfileData[0].isProfileCreated,
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = UserBao;