import express from "express";
import mongoose from "mongoose";
import { env } from "#config/Env.js";
import blogRoutes from "#routes/blogRoutes.js";
import errorHandler from "#middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api/blog", blogRoutes);
app.use(errorHandler);

const startServer = async () => {
    try {
        await mongoose.connect(env.mongodb_url);
        console.log("Connected to MongoDB");
        app.listen(env.port, () => {
            console.log(`Server is running on port http://localhost:${env.port}`);
        });
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
    }
};
startServer();

