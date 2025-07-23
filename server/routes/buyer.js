const express = require("express");
const {RegisterBuyer} = require("../controllers/buyer");
const router = express.Router();

router.post('/registerBuyer', RegisterBuyer);

module.exports = router;
