const Buyer = require('../models/buyer.model');
const Seller = require('../models/seller.model');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { maxHeaderSize } = require('http');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


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
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
       
        if (!(await isPasswordMatch(user_password, user.password))) {
            res.status(401).json({
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
