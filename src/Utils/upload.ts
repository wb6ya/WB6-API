// @ts-nocheck
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { env } from "../Config/Env.js";

cloudinary.config({
    cloud_name: env.cloudinary_cloud_name,
    api_key: env.cloudinary_api_key,
    api_secret: env.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "portfolio_uploads",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    },
});

const upload = multer({ storage });

export { upload as default, cloudinary };

