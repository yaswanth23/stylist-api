const Base = require("./base");
const logger = require("../common/logger")("admin-bao");
const constants = require("../common/constants");
const nodemailer = require("nodemailer");
const { CryptoService } = require("../services");
const { AdminDao } = require("../dao");

class AdminBao extends Base {
  constructor() {
    super();
  }

  async adminLogin(emailId, password) {
    try {
      logger.info("inside adminLogin", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        let decryptedPassword = await CryptoService.decryptKey(
          findEmailId[0].saltKey,
          findEmailId[0].saltKeyIv,
          findEmailId[0].encryptedData
        );

        if (password === decryptedPassword) {
          return {
            statusCode: constants.STATUS_CODES[200],
            statusMessage: constants.STATUS_MESSAGE[200],
            emailId: findEmailId[0].emailId,
            userId: findEmailId[0]._id,
            createdOn: findEmailId[0].createdOn,
            updatedOn: findEmailId[0].updatedOn,
          };
        } else {
          return {
            statusCode: constants.STATUS_CODES[315],
            statusMessage: constants.STATUS_MESSAGE[315],
          };
        }
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

  async forgetPassword(emailId) {
    try {
      logger.info("inside forgetPassword", emailId);
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = emailRegex.test(emailId);
      if (!isValidEmail) {
        return {
          statusCode: constants.STATUS_CODES[314],
          statusMessage: constants.STATUS_MESSAGE[314],
        };
      }

      let findEmailId = await AdminDao.findEmailId(emailId);
      if (findEmailId.length > 0) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let randomPassword = "";
        for (let i = 0; i < 7; i++) {
          randomPassword += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }

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
          subject: "Your password was reset",
          text: `Hi there, We wanted to let you know that your admin account password was reset. Please find the generated password ${randomPassword} for login into your admin account.`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(error);
          } else {
            logger.info("Mail sent successfully!");
          }
        });

        let passkeyDetail = await CryptoService.encryptKey(randomPassword);
        await AdminDao.updatePasswordDetails(emailId, passkeyDetail);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: "Mail sent successfully!",
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

module.exports = AdminBao;
