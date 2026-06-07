import { z } from "zod";

const projectValidator = z.object({
    title: z.string({ 
        required_error: "Title is required", 
        invalid_type_error: "Title must be a string" 
    }).min(3, "Title must be at least 3 characters long"),
    description: z.string({ 
        required_error: "Description is required", 
        invalid_type_error: "Description must be a string" 
    }).min(10, "Description must be at least 10 characters long"),
    content: z.string({ 
        required_error: "Content is required", 
        invalid_type_error: "Content must be a string" 
    }).min(50, "Content must be at least 50 characters long"),
    image: z.string({
        invalid_type_error: "رابط الصورة يجب أن يكون نص",
    }).url({ message: "الرابط غير صالح" }).optional(),
    github_url: z.string().url("Invalid URL format").optional(),
    live_url: z.string().url("Invalid URL format").optional(),
});

export default projectValidator;