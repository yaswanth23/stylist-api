const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PicsController } = require("../controllers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/removeBg",
  upload.single("img"),
  PicsController.POST_removeBgFromImg
);

module.exports = router;
