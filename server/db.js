require("dotenv").config();

const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL;

const connectDB = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = connectDB;
