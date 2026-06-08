import { cloudinary } from "./upload.js";
import https from "https";

export const generateAndUploadImage = async (title, description) => {
    try {
        const imagePrompt = `Minimalist flat vector app icon of: ${title || description}. Pure white background, isolated, no shadows, 2D graphic design.`;
        console.log("Generated Icon Prompt:", imagePrompt);

        // We return the raw Pollinations URL directly!
        // We do NOT fetch it on the server because Vercel/Node.js are blocked by free AI providers.
        // When the frontend uses this URL in an <img> tag, the visitor's browser will load it successfully!
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=400&height=400&nologo=true`;
        
        return pollUrl;
    } catch (error) {
        console.error("AI Image Generation failed:", error);
        return null;
    }
};
