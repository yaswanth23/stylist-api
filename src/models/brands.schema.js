const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  brandId: Number,
  brandName: String,
});

const Brands = new mongoose.model("brands", schema);
module.exports = Brands;
