const express = require("express");
const router = express.Router();
const { HomeController } = require("../controllers");

router.get("/get/homePageData", HomeController.GET_homePageData);
router.get("/get/allProducts", HomeController.GET_allProducts);
router.get("/get/productDetails", HomeController.GET_productDetails);
router.get("/get/preferences", HomeController.GET_preferences);

module.exports = router;
