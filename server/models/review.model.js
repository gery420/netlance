const mongoose = require('mongoose');
const buyer = require('./buyer.model');

const { Schema } = mongoose;

const reviewSchema = new Schema({
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true,
    },
    buyerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
