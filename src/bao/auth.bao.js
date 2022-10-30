const Base = require("./base");
const logger = require("../common/logger")("auth-bao");
const { v4: uuidv4 } = require("uuid");
const { UserDao } = require("../dao");
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
        return "user already exists";
      }
      let userId = -1;
      do {
        userId = await this.generateUserId();
      } while (userId == null);
      let passKeyDetails = await CryptoService.encryptKey(password);
      let insertObj = {
        userId,
        emailId,
        passKey: passKeyDetails.encryptedData,
        saltKey: passKeyDetails.saltKey,
        saltKeyIv: passKeyDetails.saltKeyIv,
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
      await UserDao.saveUserDetails(insertObj);
      return "user registered successfully";
    } catch (e) {
      throw e;
    }
  }

  async login(emailId, password) {
    try {
      logger.info("inside login", emailId);
      let findEmailId = await UserDao.findUserEmailId(emailId);
      if (findEmailId.length < 1) {
        return "user not found";
      }
      let decryptedPassword = await CryptoService.decryptKey(
        findEmailId[0].saltKey,
        findEmailId[0].saltKeyIv,
        findEmailId[0].passKey
      );
      if (password === decryptedPassword) {
        return "user logged in successfully";
      } else {
        return "incorrect password";
      }
    } catch (e) {
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
