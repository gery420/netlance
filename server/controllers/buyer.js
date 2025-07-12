const Buyer = require('../models/buyer.model');
require('dotenv').config();
const {RegisterBuyerJoi} = require('../joi/buyerJoi');
const bcrypt = require('bcrypt');
exports.RegisterBuyer = async (req, res, next) => {
    try {
        let user = await RegisterBuyerJoi(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        let buyer = ({
        username: user.username,
        password: hashedPassword,
        email: user.email,
        phoneNumber: user.phoneNumber,
        country: user.country,
        });
        await Buyer.create(buyer);
        return res.status(200).json({
        message: "Registered Successfully",
        success: true,
    })}

    catch (error) {
        return next(error);
    }
}

