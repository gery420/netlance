const Buyer = require('../models/buyer.model');
const Seller = require('../models/seller.model');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const SendEmail = require('../utils/Email');
const TokenGenerator = require('../utils/TokenGenerator');

const otpStore = {};

const isPasswordMatch = async(password, ogpassword) => {
    return await bcrypt.compare(password, ogpassword);
} 

const signJWT = async (user_id) => {
    return await promisify(jwt.sign)({ id: user_id }, process.env.JWT_SECRET);
};

exports.Login = async (req, res, next) => {
    try {
        let user_name = req.body.username;
        let user_password = req.body.password;
        let user;

        if (req.body.type === "buyer") {
            user = await Buyer.findOne({
                username: user_name
                
            });
        } else if (req.body.type === "seller") {
            user = await Seller.findOne({
                username: user_name
            });
        } else {
            return res.status(400).json({
                message: "Invalid user type",
                success: false,
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
       
        if (!(await isPasswordMatch(user_password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Credentials",
            });      
        } 
        const token = await signJWT(user._id);
        console.log("token in login : ", token);

        //it will set the cookie in the browser
        res.cookie("s_Id", token, {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: "none", // Set to 'none' for cross-site cookies
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        console.log("Cookie header about to be sent:", res.getHeaders()["set-cookie"]);

        console.log("Token set in cookie");

        return res.status(200).json({
            message: "Login successful",
            success: true,
            token: token,
        });

    }
        
    catch (error) {
        return next(error);
    }
}

exports.Logout = async (req, res, next) => {
    try {
        console.log("Logout called");
        res.clearCookie("s_Id");
        res.status(200).json({
        success: true,
        message: "You are logged out successfully!",
        });
        console.log("Cookie cleared from browser");
    } catch (err) {
        return next(err);
    }
};

exports.GeneratePasswordResetToken = async (req, res, next) => {
    try {
        const user = await Buyer.findOne({ email: req.body.email }) || await Seller.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expireOtp = Date.now() + 5 * 60 * 1000; // 5 minutes from now

        otpStore[user.email] = { otp, expireOtp };

        console.log("Generated otp:", otp);

        let mail = {
            to: user.email,
            subject: "Password Reset Link",
            html: `Here is your requested otp: ${otp}`,
        }

        try{
            await SendEmail(mail, next);
            console.log("Password reset email sent successfully");
        }
        catch{
            console.log("Error sending password reset email");
        }

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });

    } catch (error) {
        console.log("Error occurred while generating password reset token");
        return next(error);
    }
}

exports.VerifyOtp = async (req, res, next) => {

    try{
        const { email, otp} = req.body;

        const record = otpStore[email];

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "No OTP requested",
            });
        }
        
        if (record.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (Date.now() > record.expireOtp) {
            delete otpStore[email];
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
    }

    catch (error) {
        console.log("Error occurred while verifying OTP");
        return next(error);
    }

}

exports.SetPassword = async (req, res, next) => {

    const { email ,  otp, newPassword} = req.body;
    
    try {

        const record = otpStore[email];

        if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await Buyer.findOne({ email: req.body.email }) || await Seller.findOne({ email: req.body.email });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
        
    } 
    catch (error) {
        console.log("Error occurred while setting password");
        return next(error);
    }

}

