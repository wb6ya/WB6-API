import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { env } from "#config/Env.js";

// إعداد Cloudinary
cloudinary.config({
    cloud_name: env.cloudinary_cloud_name,
    api_key: env.cloudinary_api_key,
    api_secret: env.cloudinary_api_secret,
});

// إعداد مساحة التخزين في Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "portfolio_uploads", // اسم المجلد في الكلاود
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    },
});

const upload = multer({ storage });

export default upload;
