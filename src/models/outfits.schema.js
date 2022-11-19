const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  closetItemIds: [String],
  createdOn: Date,
  updatedOn: Date,
});

const Outfit = new mongoose.model("outfit", schema);
module.exports = Outfit;
