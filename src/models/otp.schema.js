const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  emailId: String,
  otp: Number,
  isVerified: Boolean,
  status: Number,
  createdOn: Date,
});

const Otp = new mongoose.model("otp", schema);
module.exports = Otp;
