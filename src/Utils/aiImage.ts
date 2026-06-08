import { cloudinary } from "./upload.js";
import { AIError } from "./translate.js";

export const generateAndUploadImage = async (title: string, description: string) => {
    const imagePrompt = `Premium high-end 3D app icon of: ${title || description}. Masterpiece, highly detailed, beautiful soft studio lighting, vivid vibrant colors, glossy finish, modern UI/UX design, Behance top trending, pure #ffffff white background, centered and isolated. NO text, NO words, NO letters, NO logos, NO brands, NO watermarks, NO signatures.`;

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        throw new AIError(
            "بيانات اعتماد Cloudflare AI غير موجودة (CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN)",
            "إنشاء الصورة بالذكاء الاصطناعي"
        );
    }

    try {
        console.log("Fetching image from Cloudflare Workers AI...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: imagePrompt }),
                signal: controller.signal
            }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Cloudflare AI HTTP ${response.status}: ${errText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Uploading AI generated image to Cloudinary...");
        const uploadResponse = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    folder: "portfolio_uploads/ai_generated",
                },
                (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        console.log("AI Image generated and uploaded successfully.");
        
        let transparentUrl = uploadResponse.secure_url;
        transparentUrl = transparentUrl.replace('/upload/', '/upload/e_make_transparent:15/');
        transparentUrl = transparentUrl.replace(/\.jpg$/i, '.png');

        return transparentUrl;
    } catch (error: any) {
        if (error instanceof AIError) throw error;
        throw new AIError(
            `فشل إنشاء الصورة بالذكاء الاصطناعي: ${error.message || "خطأ غير معروف"}`,
            "إنشاء الصورة بالذكاء الاصطناعي"
        );
    }
};
