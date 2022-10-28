const express = require("express");
const router = express.Router();
const { OtpController } = require("../controllers");

router.post("/sendOtp", OtpController.POST_sendOtp);

module.exports = router;
