import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIError extends Error {
    constructor(message: string, public readonly step: string) {
        super(message);
        this.name = "AIError";
    }
}
let currentKeyIndex = 0;

const getApiKeys = () => {
    const keys = process.env.GEMINI_API_KEYS;
    if (keys) {
        return keys.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    const singleKey = process.env.GEMINI_API_KEY;
    if (singleKey) return [singleKey];
    return [];
};

const rotateApiKey = () => {
    const keys = getApiKeys();
    if (keys.length > 1) {
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        console.log(`[Gemini API] Switched to Key #${currentKeyIndex + 1} of ${keys.length}`);
    }
};

const withRetry = async <T>(fn: (apiKey: string) => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try {
        const keys = getApiKeys();
        if (keys.length === 0) {
            throw new Error("مفتاح Gemini API غير موجود في إعدادات البيئة (GEMINI_API_KEY أو GEMINI_API_KEYS)");
        }
        const apiKey = keys[currentKeyIndex % keys.length];
        return await fn(apiKey);
    } catch (error: any) {
        const isRateLimitOrUnavailable = error.status === 503 || error.status === 429 || (error.message && (error.message.includes('503') || error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted')));
        
        if (retries > 0 && isRateLimitOrUnavailable) {
            console.log(`Gemini API 503/429/Quota error. Rotating key...`);
            rotateApiKey();
            console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const improveArabicText = async (title: string, description: string, content: string) => {
    try {
        const executeImprovement = async (apiKey: string) => {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-flash-latest",
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
            You are an expert Arabic copywriter and editor. Your task is to improve the following Arabic blog post content.
            Rewrite it to be in a formal, beautiful, and highly professional style. Fix any grammatical errors and improve the vocabulary.
            
            IMPORTANT HTML INSTRUCTIONS for the 'content' field:
            The content may contain HTML tags (like <p>, <strong>, <img>, <a>, <h2>, etc.).
            You MUST preserve all HTML tags EXACTLY as they are. Do not remove, alter, or restructure the HTML tags.
            Only improve the Arabic text inside the HTML tags. Do not translate anything, keep it in Arabic.
            
            Return ONLY a JSON object with exactly these keys: "title", "description", "content".
            Do not wrap in markdown tags like \`\`\`json. Just return the raw JSON object.
            
            Title to improve:
            ${title || ""}
            
            Description to improve:
            ${description || ""}
            
            Content to improve:
            ${content || ""}
            `;

            const result = await model.generateContent(prompt);
            return result.response.text();
        };

        let responseText = await withRetry(executeImprovement, 4, 1500);
        
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const improvedData = JSON.parse(responseText);

        if (!improvedData.title || !improvedData.description || !improvedData.content) {
            throw new Error("الذكاء الاصطناعي لم يُرجع جميع الحقول المطلوبة (title, description, content)");
        }

        return improvedData;
    } catch (error: any) {
        if (error instanceof AIError) throw error;
        throw new AIError(
            `فشل تحسين النص العربي: ${error.message || "خطأ غير معروف"}`,
            "تحسين النص العربي"
        );
    }
};

export const translateToEnglish = async (title: string, description: string, content: string) => {
    try {
        const executeTranslation = async (apiKey: string) => {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-flash-latest",
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
            You are a professional translator. Translate the following Arabic blog post content into English.
            Ensure the translation is natural, context-aware, and retains the original meaning.
            
            IMPORTANT HTML INSTRUCTIONS for the 'content' field:
            The content may contain HTML tags (like <p>, <strong>, <img>, <a>, <h2>, etc.).
            You MUST preserve all HTML tags EXACTLY as they are. Do not remove, alter, or restructure the HTML tags.
            Only translate the text inside the HTML tags to English. Leave the tags, attributes, and image URLs completely untouched.
            
            Return ONLY a JSON object with exactly these keys: "titleEn", "descriptionEn", "contentEn".
            Do not wrap in markdown tags like \`\`\`json. Just return the raw JSON object.
            
            Title to translate:
            ${title || ""}
            
            Description to translate:
            ${description || ""}
            
            Content to translate:
            ${content || ""}
            `;

            const result = await model.generateContent(prompt);
            return result.response.text();
        };

        let responseText = await withRetry(executeTranslation, 4, 1500);
        
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const translatedData = JSON.parse(responseText);

        if (!translatedData.titleEn || !translatedData.descriptionEn || !translatedData.contentEn) {
            throw new Error("الذكاء الاصطناعي لم يُرجع جميع الحقول المترجمة (titleEn, descriptionEn, contentEn)");
        }

        return translatedData;
    } catch (error: any) {
        if (error instanceof AIError) throw error;
        throw new AIError(
            `فشلت الترجمة للإنجليزية: ${error.message || "خطأ غير معروف"}`,
            "الترجمة للإنجليزية"
        );
    }
};
