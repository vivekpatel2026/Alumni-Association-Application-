const cloudinary=require("cloudinary").v2;
require("dotenv").config();
const{ CloudinaryStorage } =require("multer-storage-cloudinary");

//Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Create instance of cloudinary storage

const storage =new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "AlumniApp",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

module.exports= storage;
