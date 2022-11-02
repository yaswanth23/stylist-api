const { Otp } = require("../models");

module.exports.saveOtpDetails = async (emailId, otp, status) => {
  try {
    const insertObj = {
      emailId,
      otp,
      isVerified: false,
      status,
      createdOn: new Date().toISOString(),
    };
    const data = new Otp(insertObj);
    data.save();
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.findOtpDetails = async (emailId, otp) => {
  try {
    const data = await Otp.find({ emailId, otp, isVerified: false });
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports.updateOtpDetails = async (otpId) => {
  try {
    let whereObj = { _id: otpId };
    let updateObj = { $set: { isVerified: true } };
    const data = await Otp.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    throw e;
  }
};
