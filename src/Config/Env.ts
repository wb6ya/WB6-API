import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT,
  mongodb_url: process.env.MONGODB_URL,
  jwt_secret: process.env.JWT_SECRET,
  cors_origin: process.env.CORS_ORIGIN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};