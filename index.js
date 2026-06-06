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

// ==========================================
// 🛡️ Security & Performance Middlewares
// ==========================================

// 1. Set Security HTTP Headers (يحمي من هجمات كثيرة بإضافة ترويسات أمنية)
app.use(helmet());

// 2. Enable CORS (يسمح للواجهة الأمامية بالاتصال بالسيرفر)
app.use(cors());

// 3. Rate Limiting (يمنع الـ Spam بإعطاء كل مستخدم 100 طلب فقط كل 15 دقيقة)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: { success: false, message: "لقد تجاوزت الحد المسموح من الطلبات، الرجاء المحاولة بعد 15 دقيقة." }
});
app.use("/api", limiter);

// 4. Body Parser (يسمح للسيرفر بقراءة الـ JSON)
app.use(express.json());

// ==========================================
// 🚀 Application Routes
// ==========================================
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);

// ==========================================
// 🚨 Global Error Handler
// ==========================================
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

