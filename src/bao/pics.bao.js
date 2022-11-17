const Base = require("./base");
const logger = require("../common/logger")("pics-bao");
const constants = require("../common/constants");
const fs = require("fs");
const { S3Service, RemoveBg } = require("../services");
const path = require("path");
class PicsBao extends Base {
  constructor() {
    super();
  }

  async removeBgFromImg(imageUrl) {
    try {
      logger.info("inside removeBgFromImg");
      let base64Data = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (base64Data.length !== 3) {
        return {
          statusCode: constants.STATUS_CODES[304],
          statusMessage: constants.STATUS_MESSAGE[304],
        };
      }
      const uploadFileResult = await S3Service.uploadDummyPicToS3(base64Data);
      const fileName = Date.now().toString() + ".png";
      let baseDir = path.join(__dirname, "../../uploads/");
      let filePath = baseDir + fileName;

      await RemoveBg.removeBgFromImg(uploadFileResult.Location, filePath);
      let imageData = fs.readFileSync(filePath, "base64");
      fs.unlinkSync(filePath);
      return {
        statusCode: constants.STATUS_CODES[200],
        statusMessage: constants.STATUS_MESSAGE[200],
        imageData,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}

module.exports = PicsBao;
