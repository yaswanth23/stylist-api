const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME_1 = "stylistuserprofilepictures";
const BUCKET_NAME_2 = "stylistuserclosetpictures";
const BUCKET_NAME_3 = "stylistdummypics";

module.exports.uploadProfilePicToS3 = async (base64Data) => {
  const fileName = Date.now().toString() + ".png";
  const params = {
    Bucket: BUCKET_NAME_1,
    acl: "public-read",
    ContentEncoding: "base64",
    ContentType: base64Data[1],
    Key: fileName,
    Body: Buffer.from(base64Data[2], "base64"),
  };
  return s3.upload(params).promise();
};

module.exports.uploadClosetPicToS3 = async (base64Data) => {
  const fileName = Date.now().toString() + ".png";
  const params = {
    Bucket: BUCKET_NAME_2,
    acl: "public-read",
    ContentEncoding: "base64",
    ContentType: base64Data[1],
    Key: fileName,
    Body: Buffer.from(base64Data[2], "base64"),
  };
  return s3.upload(params).promise();
};

module.exports.uploadDummyPicToS3 = async (base64Data) => {
  const fileName = Date.now().toString() + ".png";
  const params = {
    Bucket: BUCKET_NAME_3,
    acl: "public-read",
    ContentEncoding: "base64",
    ContentType: base64Data[1],
    Key: fileName,
    Body: Buffer.from(base64Data[2], "base64"),
  };
  return s3.upload(params).promise();
};
