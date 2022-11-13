const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  itemImageUrl: String,
  category: String,
  brand: String,
  season: String,
  colorCode: String,
  createdOn: Date,
});

const Closet = new mongoose.model("closet", schema);
module.exports = Closet;