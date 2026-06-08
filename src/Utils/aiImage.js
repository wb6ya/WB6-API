import { cloudinary } from "./upload.js";

export const generateAndUploadImage = async (title, description) => {
    try {
        const imagePrompt = `Minimalist flat vector app icon of: ${title || description}. Pure white background, isolated, no shadows, 2D graphic design.`;
        console.log("Generated Icon Prompt:", imagePrompt);

        // Use Pollinations AI (free, no key required) with square aspect ratio
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=400&height=400&nologo=true`;

        console.log("Fetching image from Pollinations AI...");
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch from Pollinations: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload directly to Cloudinary via stream
        console.log("Uploading AI generated image to Cloudinary...");
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "portfolio_uploads/ai_generated" },
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
