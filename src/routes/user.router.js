const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
let upload = multer({ dest: "uploads/" });
const { UserController } = require("../controllers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
upload = multer({ storage: storage });

router.get("/getUserDetails", UserController.GET_userDetails);
router.post(
  "/userProfile",
  upload.single("profilePic"),
  UserController.POST_userProfile
);

module.exports = router;
