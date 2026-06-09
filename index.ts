import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import { env } from "./src/Config/Env.js";
import blogRoutes from "./src/Routes/blogRoutes.js";
import errorHandler from "./src/Middleware/errorHandler.js";
import authRoutes from "./src/Routes/authRoutes.js";
import projectRoutes from "./src/Routes/projectRoutes.js";
import tagRoutes from "./src/Routes/tagRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "لقد تجاوزت الحد المسموح من الطلبات، الرجاء المحاولة بعد 15 دقيقة." }
});
app.use("/api", limiter);
app.use(express.json());

// Security: Prevent NoSQL injection
app.use(mongoSanitize());

// Security: Prevent XSS
app.use(xss());

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(env.mongodb_url);
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/tags", tagRoutes);

app.use(errorHandler);

if (!process.env.VERCEL) {
    app.listen(env.port || 5500, () => {
        console.log(`Server is running on port http://localhost:${env.port || 5500}`);
    });
}

export default app;
