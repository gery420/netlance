const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../utils/Errors");
const { promisify } = require("util");
const Buyer = require("../models/buyer.model");
const Seller = require("../models/seller.model");
require("dotenv").config();

//it will be executed on every request.If the token is not found then the user will need to login into the system.
const Auth = async (req, _res, next) => {
  try {
    let token = req.cookies.s_Id;
    if (!token) {
        throw new AuthenticationError("Please login!");
    }
    const decoder = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let user = await Buyer.findById(decoder.id);
    if (!user) {
        user = await Seller.findById(decoder.id);
        if (!user) {
            throw new AuthenticationError("Something went wrong...!!");
        }
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("error auth middleware : ", err);
    return next(err);
  }
};
module.exports = Auth;
