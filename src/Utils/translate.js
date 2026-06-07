import { GoogleGenerativeAI } from "@google/generative-ai";

export const improveArabicText = async (title, description, content) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Skipping text improvement.");
            return { title: title || "", description: description || "", content: content || "" };
        }

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
        return improvedData;
    } catch (error) {
        console.error("Text improvement failed:", error);
        return { title: title || "", description: description || "", content: content || "" };
    }
};

export const translateToEnglish = async (title, description, content) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Skipping translation.");
            return { titleEn: "", descriptionEn: "", contentEn: "" };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-flash-latest which points to the newest available flash model
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
        
        // Clean up markdown block if the model outputs it despite instructions
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const translatedData = JSON.parse(responseText);
        return translatedData;
    } catch (error) {
        console.error("Translation failed:", error);
        return { titleEn: "", descriptionEn: "", contentEn: "" };
    }
};
