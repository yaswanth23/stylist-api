const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  emailId: String,
  name: String,
  saltKey: String,
  saltKeyIv: String,
  encryptedData: String,
  isActive: Boolean,
  role: String,
  lastActive: Date,
  createdOn: Date,
  updatedOn: Date,
});

const AdminUser = new mongoose.model("adminUserDetails", schema);
module.exports = AdminUser;
