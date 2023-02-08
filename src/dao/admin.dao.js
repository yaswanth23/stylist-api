const { AdminUser } = require("../models");
const logger = require("../common/logger")("adminuser-dao");

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

module.exports.getAllBrands = async (page, limit) => {
  try {
    const data = await AdminUser.find({ role: "brand" })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findAdminUserId = async (adminUserId) => {
  try {
    const data = await AdminUser.find({ _id: adminUserId, isActive: true });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.findBrandUserId = async (brandUserId) => {
  try {
    const data = await AdminUser.find({
      _id: brandUserId,
      isActive: true,
      role: "brand",
    });
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports.deleteBrandAccount = async (whereObj) => {
  try {
    const data = await AdminUser.deleteMany(whereObj);
    return data;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
