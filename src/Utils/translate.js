import { GoogleGenerativeAI } from "@google/generative-ai";

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
