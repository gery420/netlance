require('dotenv').config();
const {RegisterSellerJoi} = require('../joi/sellerJoi');
const Seller = require('../models/seller.model');
const bcrypt = require('bcrypt');
const Gig = require('../models/gig.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');

exports.RegisterSeller = async (req, res, next) => {
    try {
        console.log("\nRegistering Seller controller called");
        let user = await RegisterSellerJoi(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        let seller = new Seller({
            name: user.name,
            username: user.username,
            password: hashedPassword,
            email: user.email,
            phonenumber: user.phonenumber,
            country: user.country,
            type: user.type,
            profilePicture: req.files.profilePicture?.[0]?.path,
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


exports.Dashboard = async (req, res) => {
    try {
        console.log("\nSeller Dashboard controller called");
        let sellerId = req.user._id;
        let gigs = await Gig.find({sellerID: sellerId});
        let orders = await Order.find({sellerID: sellerId}).populate(
            {
                path: 'gigID',
                model: 'Gig',
            })
            .populate({
                path: 'buyerID',
                model: 'Buyer',
                select: 'username'
            });
        let reviews = await Review.find({
            gigId : {$in: gigs.map(gig => gig._id)}
        }).populate({
            path: 'buyerId',
            model: 'Buyer',
            select: '-password -__v'
        })
        .populate({
            path: 'gigId',
            model: 'Gig',
        });

        return res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: {
                gigs,
                orders,
                reviews,
            }
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch dashboard data",
        });
    }
}
