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

const createAccessToken = async (user_id, user_type) => {
    return await promisify(jwt.sign)({ id: user_id, userType: user_type }, process.env.JWT_SECRET, { expiresIn: '30m' });
}

const createRefreshToken = async (user_id, user_type) => {
    return await promisify(jwt.sign)({ id: user_id, userType: user_type }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const signJWT = async (user_id, user_type) => {
    return await promisify(jwt.sign)({ id: user_id, userType: user_type }, process.env.JWT_SECRET);
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
        console.log("User found:", user._id);
        console.log("User type:", user.type);
        const accessToken = await createAccessToken(user._id, user.type);
        const refreshToken = await createRefreshToken(user._id, user.type);

        return res.status(200).json({
            message: "Login successful",
            success: true,
            accessToken: accessToken,
            userType: user.type,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                country: user.country,
                desc: user.desc,
                profilePicture: user.profilePicture || null, // Ensure profilePicture is included
            }
        });

    }
        
    catch (error) {
        return next(error);
    }
}

exports.Logout = async (req, res, next) => {
    try {
        console.log("Logout called");
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

exports.ResetPassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        const user = await Buyer.findById(req.user.id) || await Seller.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log("Error occurred while resetting password");
        return next(error);
    }
}

exports.UpdateProfile = async (req, res, next) => {
    try {
        const { name, username, phonenumber } = req.body;
        const user = await Buyer.findById(req.user.id) || await Seller.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.phonenumber = phonenumber || user.phonenumber;

        if (req.files && req.files.profilePicture) {
            user.profilePicture = req.files.profilePicture[0].path; // Assuming the file path is stored in the profilePicture field
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: {
                name: user.name,
                username: user.username,
                phonenumber: user.phonenumber,
                profilePicture: user.profilePicture || null, // Ensure profilePicture is included
            }
        });
    } catch (error) {
        console.log("Error occurred while updating profile");
        return next(error);
    }
}
