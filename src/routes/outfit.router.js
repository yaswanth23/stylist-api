const express = require("express");
const router = express.Router();
const { OutfitController } = require("../controllers");

router.post("/createOutfit", OutfitController.POST_createOutfit);
router.post("/removeOutfitItem", OutfitController.POST_removeOutfitItem);

module.exports = router;
