const express = require("express");
const router = express.Router();
const { HomeController } = require("../controllers");

router.get("/get/allProducts", HomeController.GET_allProducts);
router.get("/get/productDetails", HomeController.GET_productDetails);

module.exports = router;
