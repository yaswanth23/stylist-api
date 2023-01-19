const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  emailId: String,
  saltKey: String,
  saltKeyIv: String,
  encryptedData: String,
  isActive: Boolean,
  createdOn: Date,
  updatedOn: Date,
});

const AdminUser = new mongoose.model("adminUserDetails", schema);
module.exports = AdminUser;
