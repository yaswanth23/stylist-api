const Base = require("./base");
const nodemailer = require("nodemailer");
const logger = require("../common/logger")("otp-bao");
const { OtpDao } = require("../dao");

class OtpBao extends Base {
  constructor() {
    super();
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
      OtpDao.saveOtpDetails(emailId, generateOtp);
      return "OTP sent Successfully";
    } catch (e) {
      throw e;
    }
  }

  async verifyOtp(emailId, otp) {
    try {
      logger.info("inside verifyOtp", emailId, otp);
      const otpDetails = await OtpDao.findOtpDetails(emailId, otp);
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
          return "otp has expired";
        }
        OtpDao.updateOtpDetails(otpId);
        return "otp verified successfully";
      } else {
        return "invalid otp";
      }
    } catch (e) {
      throw e;
    }
  }
}

module.exports = OtpBao;
