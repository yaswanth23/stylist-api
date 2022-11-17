const fs = require("fs");
const request = require("request");

module.exports.removeBgFromImg = async (imageUrl, filePath) => {
  try {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: "https://api.remove.bg/v1.0/removebg",
          formData: {
            image_url: imageUrl,
            size: "auto",
          },
          headers: {
            "X-API-Key": process.env.REMOVE_BG_API_KEY_ID,
          },
          encoding: null,
        },
        function (error, response, body) {
          if (error) reject(error);
          // return console.error(
          //   "Request failed because invalid url or file",
          //   error
          // );
          if (response.statusCode != 200)
            return console.error(
              "error:",
              response.statusCode,
              body.toString("utf8")
            );
          fs.writeFileSync(filePath, body);
          if (response.statusCode == 200) {
            resolve(console.log("Image without bg created"));
          }
        }
      );
    });
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
