import { GoogleGenerativeAI } from "@google/generative-ai";
import { cloudinary } from "./upload.js";

export const generateAndUploadImage = async (title, description) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Skipping AI image generation.");
            return null;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are an expert prompt engineer. Create a short English prompt (maximum 20 words) for generating an icon representing a blog post.
        The image should be a minimalist, modern, flat vector application icon with a solid background, suitable for a portfolio thumbnail.
        
        Blog Title: ${title || ""}
        Blog Description: ${description || ""}
        
        Return ONLY the prompt text, without any quotes or extra words.
        `;

        const result = await model.generateContent(prompt);
        let imagePrompt = result.response.text().trim();
        
        // Remove quotes if the AI added them
        imagePrompt = imagePrompt.replace(/^["'](.*)["']$/, '$1');

        console.log("Generated Icon Prompt:", imagePrompt);

        // Use Pollinations AI (free, no key required) with square aspect ratio
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=400&height=400&nologo=true`;

        // Upload directly to Cloudinary
        console.log("Uploading AI generated image to Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: "portfolio_uploads/ai_generated"
        });

        console.log("AI Image generated and uploaded successfully.");
        return uploadResponse.secure_url;
    } catch (error) {
        console.error("AI Image Generation failed:", error);
        return null;
    }
};
