const express = require("express");
const router = express.Router();
const {
    Login,
    Logout,
    ResetPassword,
} = require("../controllers/auth");

router.post("/login", Login);
router.get("/logout", Logout);
router.post("/resetpassword", ResetPassword);

module.exports = router;
