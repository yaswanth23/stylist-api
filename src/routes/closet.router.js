const express = require("express");
const router = express.Router();
const { ClosetController } = require("../controllers");

router.get("/getCategories", ClosetController.GET_getCategories);
router.get("/getBrands", ClosetController.GET_getBrands);
router.post("/addToCloset", ClosetController.POST_addToCloset);
// router.get("/getClosetDetails", ClosetController.GET_getClosetDetails);

module.exports = router;
