const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const {GetUser} = require("../controllers/common");

router.get("/profile", GetUser);

module.exports = router;
