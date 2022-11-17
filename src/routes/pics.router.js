const express = require("express");
const router = express.Router();
const { PicsController } = require("../controllers");

router.post("/removeBg", PicsController.POST_removeBgFromImg);

module.exports = router;
