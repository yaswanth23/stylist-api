const Base = require("./base");
const nodemailer = require("nodemailer");
const logger = require("../common/logger")("otp-bao");
const { OtpDao, UserDao } = require("../dao");
const constants = require("../common/constants");
class OtpBao extends Base {
  constructor() {
    super();
  }

  async sendOtp(emailId, status) {
    try {
      logger.info("inside sendOtp", emailId, status);
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
      let mailOptions;
      if (status == 2) {
        mailOptions = {
          from: process.env.EMAIL_ID,
          to: emailId,
          subject: "User Account Verification",
          text: `Hi there, Kindly use the OTP ${generateOtp} for login into your account. Valid only for 5 minutes.`,
        };
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(error);
        } else {
          logger.info("Mail sent successfully!");
        }
      });
      OtpDao.saveOtpDetails(emailId, generateOtp, status);
      return {
        statusCode: constants.STATUS_CODES[200],
        statusMessage: "OTP sent successfully",
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async verifyOtp(emailId, otp, status) {
    try {
      logger.info("inside verifyOtp", emailId, otp, status);
      const otpDetails = await OtpDao.findOtpDetails(emailId, otp, status);
      if (otpDetails.length > 0) {
        let otpId;
        let expiredFlag = true;
        otpDetails.forEach((element) => {
          let diff = Math.abs(new Date() - element.createdOn);
          let minutes = Math.floor(diff / 1000 / 60);
          logger.info("minutes", minutes);
          if (minutes <= 5) {
            otpId = element._id;
            expiredFlag = false;
          }
        });
        if (expiredFlag) {
          return {
            statusCode: constants.STATUS_CODES[402],
            statusMessage: constants.STATUS_MESSAGE[402],
          };
        }
        OtpDao.updateOtpDetails(otpId);
        let userDetails = await UserDao.findUserEmailId(emailId);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "otp verified successfully",
          userId: userDetails[0].userId,
          emailId: userDetails[0].emailId,
          isProfileCreated: userDetails[0].isProfileCreated,
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[401],
          statusMessage: constants.STATUS_MESSAGE[401],
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = OtpBao;
