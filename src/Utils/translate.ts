import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIError extends Error {
    constructor(message: string, public readonly step: string) {
        super(message);
        this.name = "AIError";
    }
}

export const improveArabicText = async (title: string, description: string, content: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new AIError("مفتاح Gemini API غير موجود في إعدادات البيئة (GEMINI_API_KEY)", "تحسين النص العربي");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are an expert Arabic copywriter and editor. Your task is to improve the following Arabic blog post content.
        Rewrite it to be in a formal, beautiful, and highly professional style. Fix any grammatical errors and improve the vocabulary.
        
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
        let responseText = result.response.text();
        
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new AIError("مفتاح Gemini API غير موجود في إعدادات البيئة (GEMINI_API_KEY)", "الترجمة للإنجليزية");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are a professional translator. Translate the following Arabic blog post content into English.
        Ensure the translation is natural, context-aware, and retains the original meaning.
        
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
        let responseText = result.response.text();
        
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
