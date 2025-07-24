const mongoose = require('mongoose');

const {Schema} = mongoose;

const buyerSchema = new Schema({
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
        type: String,
        required: true,
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
        default: "buyer",
    },
    isSeller: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true,
}
);

const buyer = mongoose.model("buyer", buyerSchema);

module.exports = buyer;
