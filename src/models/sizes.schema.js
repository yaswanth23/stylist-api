const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  sizeId: Number,
  sizeCode: String,
  sizeName: String,
});

const Sizes = new mongoose.model("size", schema);
module.exports = Sizes;
