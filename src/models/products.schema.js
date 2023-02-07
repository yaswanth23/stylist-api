const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  brandId: String,
  productId: String,
  productName: String,
  productPrice: Number,
  productDescription: String,
  productColor: String,
  imageUrls: [String],
  productCategory: String,
  seasons: [String],
  productSizes: [String],
  productButtonLink: String,
  productStatus: String,
  createdOn: Date,
  updatedOn: Date,
});

const Products = new mongoose.model("product", schema);
module.exports = Products;
