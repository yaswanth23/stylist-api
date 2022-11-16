const express = require("express");
const router = express.Router();
const { ClosetController } = require("../controllers");

router.get("/getCategories", ClosetController.GET_getCategories);
router.get("/getBrands", ClosetController.GET_getBrands);
router.post("/addToCloset", ClosetController.POST_addToCloset);
router.get("/getClosetDetails", ClosetController.GET_getClosetDetails);
router.post("/getOneClosetDetails", ClosetController.POST_getOneClosetDetails);
router.post("/removeClosetItem", ClosetController.POST_removeClosetItem);
router.post("/filterCloset", ClosetController.POST_filterCloset);
router.post("/editClosetDetails", ClosetController.POST_editClosetDetails);

module.exports = router;
