const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryId: Number,
  subCategoryName: String,
});

const schema = new mongoose.Schema({
  categoryId: Number,
  categoryName: String,
  subCategory: [subCategorySchema],
});

const Categories = new mongoose.model("categories", schema);
module.exports = Categories;
