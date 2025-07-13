const Buyer = require('../models/buyer.model');
const Seller = require('../models/seller.model');
require('dotenv').config();
const bcrypt = require('bcrypt');
const isPasswordMatch = async(password, ogpassword) => {
    return await bcrypt.compare(password, ogpassword);
} 

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


        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                username: user.username,
                type: req.body.type,
            },
        });

    }
        
    catch (error) {
        return next(error);
    }
}

