const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  closetItemIds: [String],
  outfitImageType: String,
  name: String,
  description: String,
  seasons: [String],
  imageData: [Object],
  createdOn: Date,
  updatedOn: Date,
});

const Outfit = new mongoose.model("outfit", schema);
module.exports = Outfit;
