const express = require("express");
const {RegisterBuyer, LoginBuyer} = require("../controllers/buyer");
const router = express.Router();

router.post('/registerBuyer', RegisterBuyer);

module.exports = router;
