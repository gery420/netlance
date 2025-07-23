const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const {
    Login, Logout
} = require("../controllers/auth");

router.post("/loginUser", Login);
router.get("/logoutUser",  Logout);

module.exports = router;
