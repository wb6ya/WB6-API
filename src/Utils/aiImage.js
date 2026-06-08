import { cloudinary } from "./upload.js";
import https from "https";

export const generateAndUploadImage = async (title, description) => {
    try {
        const imagePrompt = `Minimalist flat vector app icon of: ${title || description}. Pure white background, isolated, no shadows, 2D graphic design.`;
        console.log("Generated Icon Prompt:", imagePrompt);

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;

        if (!accountId || !apiToken) {
            console.error("Cloudflare AI credentials missing.");
            return null;
        }

        console.log("Fetching image from Cloudflare Workers AI...");
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: imagePrompt }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Cloudflare AI failed: ${response.status} ${errText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload directly to Cloudinary via stream
        console.log("Uploading AI generated image to Cloudinary...");
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    folder: "portfolio_uploads/ai_generated",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        console.log("AI Image generated and uploaded successfully.");
        
        // Transform the Cloudinary URL to make the white background transparent
        let transparentUrl = uploadResponse.secure_url;
        transparentUrl = transparentUrl.replace('/upload/', '/upload/e_make_transparent:15/');
        transparentUrl = transparentUrl.replace(/\.jpg$/i, '.png');

        return transparentUrl;
    } catch (error) {
        console.error("AI Image Generation failed:", error);
        return null;
    }
};
