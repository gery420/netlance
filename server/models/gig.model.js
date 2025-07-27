const mongoose = require('mongoose');

const {Schema} = mongoose;

const gigSchema = new Schema({
    sellerID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    cover: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    revisionNumber: {
        type: Number,
        required: true,
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    starNumber: {
        type: Number,
        default: 0,
    },
    shortTitle: {
        type: String,
        required: true,
    },
    shortDesc: {
        type: String,
        required: true,
    },
    features : {
        type: [String],
        default: [],
    }

},
{
    timestamps: true,
}
);

const gig = mongoose.model("Gig", gigSchema);

module.exports = gig;
