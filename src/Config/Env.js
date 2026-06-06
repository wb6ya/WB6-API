import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT,
  mongodb_url: process.env.MONGODB_URL,
};