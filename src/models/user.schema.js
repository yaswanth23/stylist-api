const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  emailId: String,
  passKey: String,
  saltKey: String,
  saltKeyIv: String,
  createdOn: Date,
  updatedOn: Date,
});

const User = new mongoose.model("userDetails", schema);
module.exports = User;
