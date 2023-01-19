const express = require("express");
const router = express.Router();
const { AdminController } = require("../controllers");

router.post("/login", AdminController.POST_adminLogin);
router.post("/forgetPassword", AdminController.POST_forgetPassword);

module.exports = router;
