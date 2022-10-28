const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  emailId: String,
  otp: Number,
  isVerified: Boolean,
  createdOn: Date,
});

const Otp = new mongoose.model("otp", schema);
module.exports = Otp;
