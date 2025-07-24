const Seller = require('../models/seller.model');
require('dotenv').config();
const {RegisterSellerJoi} = require('../joi/sellerJoi');
const bcrypt = require('bcrypt');

exports.RegisterSeller = async (req, res, next) => {
    try {
        console.log("\nRegistering Seller controller called");
        let user = await RegisterSellerJoi(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        let seller = new Seller({
            username: user.username,
            password: hashedPassword,
            email: user.email,
            phonenumber: user.phonenumber,
            country: user.country,
            type: user.type,
        });

        await seller.save();
        return res.status(200).json({
            message: "Registered Successfully",
            success: true,
        })}

    catch (error) {
        return next(error);
    }
}
