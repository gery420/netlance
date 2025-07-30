const express = require("express");
const {RegisterBuyer} = require("../controllers/buyer");
const router = express.Router();
const upload = require("../middleware/upload");

router.post('/registerBuyer', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), RegisterBuyer);

module.exports = router;
