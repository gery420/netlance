const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const {
    Login, Logout, GeneratePasswordResetToken,VerifyOtp, SetPassword, ResetPassword
} = require("../controllers/auth");

router.post("/loginUser", Login);
router.get("/logoutUser",Auth,  Logout);
router.post("/forgotPassword", GeneratePasswordResetToken);
router.post("/verifyOtp", VerifyOtp);
router.post("/setPassword", SetPassword);
router.post("/resetPassword", Auth, ResetPassword);

module.exports = router;
