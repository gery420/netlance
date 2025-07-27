const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/Cloudinary");
console.log("✅ cloudinary uploader:", typeof cloudinary?.uploader?.upload_stream);


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "gigImages",
            allowed_formats: ["jpg", "jpeg", "png"],
            transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;

