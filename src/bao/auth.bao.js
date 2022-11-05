const Base = require("./base");
const logger = require("../common/logger")("auth-bao");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const constants = require("../common/constants");
const { UserDao, OtpDao } = require("../dao");
const { CryptoService } = require("../services");

class AuthBao extends Base {
  constructor() {
    super();
  }

  async signUp(emailId, password) {
    try {
      logger.info("inside signUp", emailId);
      let findEmailId = await UserDao.findUserEmailId(emailId);
      if (findEmailId.length > 0) {
        if (!findEmailId[0].isVerified) {
          return {
            statusCode: constants.STATUS_CODES[303],
            statusMessage: constants.STATUS_MESSAGE[303],
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[301],
            statusMessage: constants.STATUS_MESSAGE[301],
          };
        }
      }
      let userId = -1;
      do {
        userId = await this.generateUserId();
      } while (userId == null);
      let passKeyDetails = await CryptoService.encryptKey(password);
      let insertObj = {
        userId,
        emailId,
        isVerified: false,
        passKey: passKeyDetails.encryptedData,
        saltKey: passKeyDetails.saltKey,
        saltKeyIv: passKeyDetails.saltKeyIv,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
      await UserDao.saveUserDetails(insertObj);
      const otpRes = await this.sendOtp(emailId);
      if (otpRes) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "OTP sent successfully",
          status: 1,
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async login(emailId, password) {
    try {
      logger.info("inside login", emailId);
      let findEmailId = await UserDao.findUserEmailId(emailId);
      if (findEmailId.length < 1) {
        return {
          statusCode: constants.STATUS_CODES[302],
          statusMessage: constants.STATUS_MESSAGE[302],
        };
      }
      if (!findEmailId[0].isVerified) {
        return {
          statusCode: constants.STATUS_CODES[305],
          statusMessage: constants.STATUS_MESSAGE[305],
        };
      }
      let decryptedPassword = await CryptoService.decryptKey(
        findEmailId[0].saltKey,
        findEmailId[0].saltKeyIv,
        findEmailId[0].passKey
      );
      if (password === decryptedPassword) {
        return {
          userId: findEmailId[0].userId,
          emailId: findEmailId[0].emailId,
          isVerified: findEmailId[0].isVerified,
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "user logged in successfully",
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[304],
          statusMessage: constants.STATUS_MESSAGE[304],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async sendOtp(emailId) {
    try {
      logger.info("inside sendOtp", emailId);
      const generateOtp = Math.floor(Math.random() * 9000 + 1000);
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      let mailOptions = {
        from: process.env.EMAIL_ID,
        to: emailId,
        subject: "User Account Verification",
        text: `Hi there, Your OTP for account verification is ${generateOtp}. Valid only for 5 minutes.`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(error);
        } else {
          logger.info("Mail sent successfully!");
        }
      });
      OtpDao.saveOtpDetails(emailId, generateOtp, 1);
      return true;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async resetPassword(userId, password) {
    try {
      logger.info("inside resetPassword", userId);
      let userDetails = await UserDao.findUserId(userId);
      let passKeyDetails = await CryptoService.encryptKey(password);
      let insertObj = {
        passKey: passKeyDetails.encryptedData,
        saltKey: passKeyDetails.saltKey,
        saltKeyIv: passKeyDetails.saltKeyIv,
        updatedOn: new Date().toISOString(),
      };
      UserDao.updateUserPasswordDetails(insertObj, userId);
      return {
        userId: userDetails[0].userId,
        statusCode: constants.STATUS_CODES[200],
        statusMessage: "password updated successfully",
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async generateUserId() {
    let userId = uuidv4();
    let userExist = await UserDao.findUserId(userId);
    if (userExist.length == 0) {
      return userId;
    } else {
      return null;
    }
  }
}

module.exports = AuthBao;
