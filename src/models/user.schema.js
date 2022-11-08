const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  emailId: String,
  name: String,
  gender: String,
  profilePic: String,
  isProfileCreated: Boolean,
  createdOn: Date,
  updatedOn: Date,
});

const User = new mongoose.model("userDetails", schema);
module.exports = User;
