const express = require("express");
const {RegisterSeller, Dashboard} = require("../controllers/seller");
const router = express.Router();
const upload = require("../middleware/upload");
const Auth = require("../middleware/Auth");

router.post('/registerSeller', upload.fields([{ name: 'profilePicture', maxCount: 1 }]), RegisterSeller);
router.get('/dashboard', Auth, Dashboard);

module.exports = router;
