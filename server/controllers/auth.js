const Buyer = require('../models/buyer.model');
const Seller = require('../models/seller.model');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { AuthenticationError } = require('../utils/Errors');
const catchAsyncError = require('../utils/catchAsyncError');

exports.VerifyAccount = catchAsyncError(async (req, res, next) => {

    try {
        //getting the token
        console.log("\nVerification controller called");
        console.log("\ntoken ", req.params);
        let token = req.params.token;
        console.log("\nToken in verification is", token);
        //if last letter @:buyer or #:seller
        let last_sym = token.charAt(token.length - 1);
        console.log("\nlast_digit is ", last_sym);
        let a = token.slice(0, -1);
        console.log("\nA in verification is", a);
        let user;
        if (last_sym === "@") {
            user = await Buyer.find({ verifyToken: a });
            console.log("\nBuyer : ", user[0]);
        }
        else {
            user = await Seller.find({ verifyToken: a });
            console.log("Seller : ", user[0]);
        }
        //if there is no such buyer or seller
        if (!user[0]) {
            throw new AuthenticationError("No such account exists...");
        }
        console.log("Date : ", Date.now());
        console.log("user : ", new Date(user[0].verifyTokenExpiry).getTime());
        //if the token is expired then delete the record
        if (new Date(user[0].verifyTokenExpiry).getTime() < Date.now()) {
            if (last_sym === "@") {
                await Buyer.findByIdAndDelete(user[0].id);
            } else {
                await Seller.findByIdAndDelete(user[0].id);
            }
            throw new AuthenticationError(
                "invalid/expired url... please register again"
            );
        }

        console.log("user .... : ", user[0]);
    }
    
    catch (error) {
        return next(error);
    }
});

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
        console.log("token : ", token);

        //it will set the cookie in the browser
        res.cookie("s_Id", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000),
            // sameSite: 'none',
            // secure: true
        });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                username: user.username,
                type: req.body.type,
            },
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
    } catch (err) {
        return next(err);
    }
};
