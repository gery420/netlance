const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Netlance",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
