
const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    gigID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true,
    },
    buyerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true,
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'cancelled'],
        default: 'in-progress',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    paymentIntentId: {
        type: String,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
