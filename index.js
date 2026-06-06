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

// Connect to MongoDB
mongoose.connect(env.mongodb_url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(`Error connecting to MongoDB: ${error}`));

// Run server only locally (Vercel handles listening automatically)
if (!process.env.VERCEL) {
    app.listen(env.port || 5500, () => {
        console.log(`Server is running on port http://localhost:${env.port || 5500}`);
    });
}

// Vercel يحتاج لتصدير التطبيق ليعمل في بيئة Serverless
export default app;
