const mongoose = require('mongoose');

const {Schema} = mongoose;

const sellerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profilePicture: {
        type: String,
        default: "https://www.gravatar.com/avatar/",
    },
    phonenumber : {
        type: Number,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        default: "seller",
    },
    isSeller: {
        type: Boolean,
        default: true,
    },

},
{
    timestamps: true,
}
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
