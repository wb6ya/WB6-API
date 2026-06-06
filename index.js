import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { env } from "#config/Env.js";
import blogRoutes from "#routes/blogRoutes.js";
import errorHandler from "#middleware/errorHandler.js";
import authRoutes from "#routes/authRoutes.js";
import projectRoutes from "#routes/projectRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "لقد تجاوزت الحد المسموح من الطلبات، الرجاء المحاولة بعد 15 دقيقة." }
});
app.use("/api", limiter);
app.use(express.json());

app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);

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

