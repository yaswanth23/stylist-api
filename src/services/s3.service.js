const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = "stylistuserprofilepictures";

module.exports.uploadProfilePicToS3 = async (fileData) => {
  const fileContent = fs.readFileSync(fileData.path);
  const params = {
    Bucket: BUCKET_NAME,
    acl: "public-read",
    ContentEncoding: fileData.encoding,
    ContentType: fileData.mimetype,
    Key: fileData.filename,
    Body: fileContent,
  };
  return s3.upload(params).promise();
};
