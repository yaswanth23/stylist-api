const Base = require("./base");
const logger = require("../common/logger")("auth-bao");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const constants = require("../common/constants");
const { UserDao, OtpDao, ClosetDao } = require("../dao");

class AuthBao extends Base {
  constructor() {
    super();
  }

  async login(emailId, status) {
    try {
      logger.info("inside login", emailId);
      const otpRes = await this.sendOtp(emailId, status);
      let userId = -1;
      let isProfileCreated = false;
      let findEmailId = await UserDao.findUserEmailId(emailId);
      if (findEmailId.length > 0) {
        if (findEmailId[0].isProfileCreated) {
          isProfileCreated = true;
        }
        if (otpRes) {
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: "OTP sent successfully",
            userid: findEmailId[0].userId,
            emailId: findEmailId[0].emailId,
            isProfileCreated,
            status: 1,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[303],
            statusMessage: constants.STATUS_MESSAGE[303],
          };
        }
      } else {
        do {
          userId = await this.generateUserId();
        } while (userId == null);
        let insertObj = {
          userId,
          emailId,
          isProfileCreated,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
        await UserDao.saveUserDetails(insertObj);
        if (otpRes) {
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: "OTP sent successfully",
            userId,
            emailId,
            isProfileCreated,
            status: 1,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[303],
            statusMessage: constants.STATUS_MESSAGE[303],
          };
        }
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async sendOtp(emailId, status) {
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
        text: `Hi there, Kindly use the OTP ${generateOtp} for login into your account. Valid only for 5 minutes.`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(error);
        } else {
          logger.info("Mail sent successfully!");
        }
      });
      OtpDao.saveOtpDetails(emailId, generateOtp, status);
      return true;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async deleteAccount(userId) {
    try {
      logger.info("inside deleteAccount", userId);
      let userDetails = await UserDao.findUserId(userId);
      if (userDetails.length > 0) {
        let whereObj = {
          userId,
        };
        await UserDao.deleteUserAccount(whereObj);
        await ClosetDao.deleteClosetItems(whereObj);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "User account deleted successfully",
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
