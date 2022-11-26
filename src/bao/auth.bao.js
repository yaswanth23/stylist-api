const Base = require("./base");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { auth } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const logger = require("../common/logger")("auth-bao");
const client = auth.fromAPIKey(process.env.GOOGLE_SIGN_IN_CLIENT_ID);
const constants = require("../common/constants");
const { UserDao, OtpDao, ClosetDao } = require("../dao");

const appleClient = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
});

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

  async googleLogin(idToken) {
    try {
      logger.info("inside googleLogin");
      let res = await client.verifyIdToken({ idToken });
      const { email, name, picture, sub: googleid } = res.getPayload();
      const user = { email, name, picture, googleid };
      let findEmailId = await UserDao.findUserEmailId(user.email.toLowerCase());

      if (findEmailId.length > 0) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: findEmailId[0].userId,
          emailId: findEmailId[0].emailId,
          name: findEmailId[0].name == undefined ? null : findEmailId[0].name,
          gender:
            findEmailId[0].gender == undefined ? null : findEmailId[0].gender,
          profilePicUrl:
            findEmailId[0].profilePicUrl == undefined
              ? null
              : findEmailId[0].profilePicUrl,
          isProfileCreated: findEmailId[0].isProfileCreated,
        };
      } else {
        let userId = -1;
        do {
          userId = await this.generateUserId();
        } while (userId == null);
        let insertObj = {
          userId,
          emailId: user.email,
          name: user.name,
          gender: null,
          profilePicUrl: user.picture,
          isProfileCreated: false,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        };
        let userDetails = await UserDao.saveUserDetails(insertObj);
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: userDetails.userId,
          emailId: userDetails.emailId,
          name: userDetails.name == undefined ? null : userDetails.name,
          gender:
            userDetails.gender == undefined || userDetails.gender == null
              ? null
              : userDetails.gender,
          profilePicUrl:
            userDetails.profilePicUrl == undefined
              ? null
              : userDetails.profilePicUrl,
          isProfileCreated: userDetails.isProfileCreated,
        };
      }
    } catch (e) {
      logger.error(e);
      throw "failed to retrieve the user from google";
    }
  }

  async instaLogin(access_token, user_id) {
    try {
      logger.info("inside instaLogin");
      let userDetails = await UserDao.findUserInstaId(user_id);
      if (userDetails.length > 0) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: userDetails[0].userId,
          emailId: userDetails[0].emailId,
          name: userDetails[0].name == undefined ? null : userDetails[0].name,
          gender:
            userDetails[0].gender == undefined || userDetails[0].gender == null
              ? null
              : userDetails[0].gender,
          profilePicUrl:
            userDetails[0].profilePicUrl == undefined
              ? null
              : userDetails[0].profilePicUrl,
          isProfileCreated: userDetails[0].isProfileCreated,
        };
      }

      const userInfo = await user("divyagariya12");
      console.log(userInfo);

      return userInfo;
    } catch (e) {
      console.log(e);
      logger.error(e);
      throw e;
    }
  }

  async verifyUser(emailId) {
    try {
      logger.info("inside verifyUser");
      let userDetails = await UserDao.findUserEmailId(emailId);
      if (userDetails.length > 0) {
        return {
          statusCode: constants.STATUS_CODES[200],
          statusMessage: constants.STATUS_MESSAGE[200],
          userId: userDetails[0].userId,
          emailId: userDetails[0].emailId,
          name: userDetails[0].name == undefined ? null : userDetails[0].name,
          gender:
            userDetails[0].gender == undefined || userDetails[0].gender == null
              ? null
              : userDetails[0].gender,
          profilePicUrl:
            userDetails[0].profilePicUrl == undefined
              ? null
              : userDetails[0].profilePicUrl,
          isProfileCreated: userDetails[0].isProfileCreated,
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

  async appleLogin(token) {
    try {
      logger.info("inside appleLogin");
      const decodedString = jwt.decode(token, { complete: true });
      const applekey = await this.getAppleSigningKey(decodedString.header.kid);
      const payload = await this.verifyAppleJWT(token, applekey);
      if (payload) {
        if (payload.aud === "com.app.closet.stylist") {
          let findEmailId = await UserDao.findUserEmailId(
            payload.email.toLowerCase()
          );
          if (findEmailId.length > 0) {
            return {
              statusCode: constants.STATUS_CODES[200],
              statusMessage: constants.STATUS_MESSAGE[200],
              userId: findEmailId[0].userId,
              emailId: findEmailId[0].emailId,
              name:
                findEmailId[0].name == undefined ? null : findEmailId[0].name,
              gender:
                findEmailId[0].gender == undefined
                  ? null
                  : findEmailId[0].gender,
              profilePicUrl:
                findEmailId[0].profilePicUrl == undefined
                  ? null
                  : findEmailId[0].profilePicUrl,
              isProfileCreated: findEmailId[0].isProfileCreated,
            };
          } else {
            let userId = -1;
            do {
              userId = await this.generateUserId();
            } while (userId == null);
            let insertObj = {
              userId,
              emailId: payload.email.toLowerCase(),
              name: null,
              gender: null,
              profilePicUrl: null,
              isProfileCreated: false,
              createdOn: new Date().toISOString(),
              updatedOn: new Date().toISOString(),
            };
            let userDetails = await UserDao.saveUserDetails(insertObj);
            return {
              statusCode: constants.STATUS_CODES[200],
              statusMessage: constants.STATUS_MESSAGE[200],
              userId: userDetails.userId,
              emailId: userDetails.emailId,
              name: userDetails.name == undefined ? null : userDetails.name,
              gender:
                userDetails.gender == undefined || userDetails.gender == null
                  ? null
                  : userDetails.gender,
              profilePicUrl:
                userDetails.profilePicUrl == undefined
                  ? null
                  : userDetails.profilePicUrl,
              isProfileCreated: userDetails.isProfileCreated,
            };
          }
        } else {
          return {
            statusCode: constants.STATUS_CODES[313],
            statusMessage: constants.STATUS_MESSAGE[313],
          };
        }
      }
      return payload;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async getAppleSigningKey(kid) {
    return new Promise((resolve) => {
      appleClient.getSigningKey(kid, (err, key) => {
        if (err) {
          console.log(err);
          resolve(null);
          return;
        }
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }

  async verifyAppleJWT(json, publicKey) {
    return new Promise((resolve) => {
      jwt.verify(json, publicKey, (err, payload) => {
        if (err) {
          return resolve(null);
        }
        resolve(payload);
      });
    });
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
