const express = require("express");
const {RegisterSeller} = require("../controllers/seller");
const router = express.Router();

router.post('/registerSeller', RegisterSeller);

module.exports = router;
