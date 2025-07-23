const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const {
    Login, Logout, VerifyAccount
} = require("../controllers/auth");

router.get("/verifyAccount/:token", VerifyAccount);
router.post("/loginUser",Auth, Login);
router.get("/logoutUser",  Logout);

module.exports = router;
