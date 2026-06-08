import { cloudinary } from "./upload.js";
import https from "https";

export const generateAndUploadImage = async (title, description) => {
    try {
        const imagePrompt = `Minimalist flat vector app icon of: ${title || description}. Pure white background, isolated, no shadows, 2D graphic design.`;
        console.log("Generated Icon Prompt:", imagePrompt);

        let response = null;
        const apiKey = process.env.HF_API_KEY;

        try {
            if (!apiKey) throw new Error("HF_API_KEY is not set.");
            
            console.log("Attempting to fetch image from Hugging Face AI using native https...");
            const data = JSON.stringify({ inputs: imagePrompt });

            response = await new Promise((resolve, reject) => {
                const req = https.request(
                    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                            "Content-Length": Buffer.byteLength(data),
                        },
                    },
                    (res) => {
                        let chunks = [];
                        res.on("data", (chunk) => chunks.push(chunk));
                        res.on("end", () => {
                            const buffer = Buffer.concat(chunks);
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                                resolve({ ok: true, buffer });
                            } else {
                                resolve({ ok: false, status: res.statusCode, text: buffer.toString() });
                            }
                        });
                    }
                );

                req.on("error", (e) => reject(e));
                req.setTimeout(20000, () => {
                    req.destroy();
                    reject(new Error("Request timed out"));
                });
                req.write(data);
                req.end();
            });

            if (!response.ok) {
                throw new Error(`Hugging Face API returned ${response.status}: ${response.text}`);
            }
        } catch (error) {
            console.warn(`Hugging Face failed (${error.message}). Falling back to Pollinations AI...`);
            
            // Fallback to Pollinations AI (Works locally, blocked on Vercel)
            const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=400&height=400&nologo=true`;
            response = await new Promise((resolve, reject) => {
                https.get(pollUrl, (res) => {
                    let chunks = [];
                    res.on("data", (chunk) => chunks.push(chunk));
                    res.on("end", () => {
                        const buffer = Buffer.concat(chunks);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve({ ok: true, buffer });
                        } else {
                            resolve({ ok: false, status: res.statusCode });
                        }
                    });
                }).on("error", reject);
            });
            
            if (!response.ok) {
                throw new Error(`Both image APIs failed. Pollinations returned: ${response.status}`);
            }
        }
        
        const buffer = response.buffer;

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
