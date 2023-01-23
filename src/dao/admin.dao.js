const { AdminUser } = require("../models");

module.exports.findEmailId = async (emailId) => {
  try {
    const data = await AdminUser.find({ emailId: emailId, isActive: true });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.updatePasswordDetails = async (emailId, passkeyDetail) => {
  try {
    let whereObj = { emailId };
    let updateObj = {
      $set: {
        saltKey: passkeyDetail.saltKey,
        saltKeyIv: passkeyDetail.saltKeyIv,
        encryptedData: passkeyDetail.encryptedData,
        updatedOn: new Date().toISOString(),
      },
    };
    const data = await AdminUser.updateOne(whereObj, updateObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.getBrandUserCount = async () => {
  try {
    const count = await AdminUser.countDocuments({ role: "brand" });
    return count;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.saveUserDetails = async (insertObj) => {
  try {
    const data = new AdminUser(insertObj);
    data.save();
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
