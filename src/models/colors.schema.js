const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  colorId: Number,
  colorCode: String,
  colorName: String,
});

const Colors = new mongoose.model("colors", schema);
module.exports = Colors;
