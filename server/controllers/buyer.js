const Buyer = require('../models/buyer.model');
require('dotenv').config();
const {RegisterBuyerJoi} = require('../joi/buyerJoi');
const bcrypt = require('bcrypt');

exports.RegisterBuyer = async (req, res, next) => {
    try {
        console.log("\nRegistering Buyer controller called");
        let user = await RegisterBuyerJoi(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        let buyer = new Buyer({
            username: user.username,
            password: hashedPassword,
            email: user.email,
            phonenumber: user.phonenumber,
            country: user.country,
            type: user.type,
        });

        await buyer.save();
        return res.status(200).json({
            message: "Registered Successfully",
            success: true,
        })}

    catch (error) {
        return next(error);
    }
}
