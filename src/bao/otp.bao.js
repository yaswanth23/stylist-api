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
      if (status == 1) {
        mailOptions = {
          from: process.env.EMAIL_ID,
          to: emailId,
          subject: "User Account Verification",
          text: `Hi there, Your OTP for account verification is ${generateOtp}. Valid only for 5 minutes.`,
        };
      }
      if (status == 2) {
        mailOptions = {
          from: process.env.EMAIL_ID,
          to: emailId,
          subject: "Forget Password Verification",
          text: `Hi there, Your OTP for forget password verification is ${generateOtp}. Valid only for 5 minutes.`,
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
        if (status == 1) {
          if (userDetails.length > 0) {
            if (userDetails[0].isVerified) {
              return {
                userId: userDetails[0].userId,
                statusCode: constants.STATUS_CODES[200],
                statusMessage: "user already verified",
              };
            }
          }
          UserDao.updateOtpDetails(emailId);
          return {
            userId: userDetails[0].userId,
            statusCode: constants.STATUS_CODES[200],
            statusMessage: "user regiestered successfully",
          };
        }
        return {
          userId: userDetails[0].userId,
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "otp verified successfully",
        };
      } else {
        return {
          statusCode: constants.STATUS_CODES[401],
          statusMessage: constants.STATUS_MESSAGE[401],
        };
      }
    } catch (e) {
      throw e;
    }
  }
}

module.exports = OtpBao;
