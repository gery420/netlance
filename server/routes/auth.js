const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const {
    Login, Logout, GeneratePasswordResetToken,VerifyOtp, SetPassword, ResetPassword, UpdateProfile
} = require("../controllers/auth");
const upload = require("../middleware/upload");

router.post("/loginUser", Login);
router.get("/logoutUser",Auth,  Logout);
router.post("/forgotPassword", GeneratePasswordResetToken);
router.post("/verifyOtp", VerifyOtp);
router.post("/setPassword", SetPassword);
router.post("/resetPassword", Auth, ResetPassword);
router.post("/updateProfile", upload.single("profilePicture"), Auth, UpdateProfile);

module.exports = router;
