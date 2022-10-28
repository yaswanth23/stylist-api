const { Otp } = require("../models");

module.exports.saveOtpDetails = async (emailId, otp) => {
  try {
    const insertObj = {
      emailId: emailId,
      otp: otp,
      isVerified: false,
      createdOn: new Date().toISOString(),
    };
    const data = new Otp(insertObj);
    data.save();
    return data;
  } catch (e) {}
};
