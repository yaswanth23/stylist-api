const express = require("express");
const router = express.Router();
const { ClosetController } = require("../controllers");

router.get("/getCategories", ClosetController.GET_getCategories);

module.exports = router;
