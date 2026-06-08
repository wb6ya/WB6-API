// @ts-nocheck
import { z } from "zod";

const BlogValidator = z.object({
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
    
    image: z.union([
        z.string().url({ message: "Image URL must be a valid URL" }),
        z.instanceof(Buffer, { message: "Image must be a file" })
    ]).optional(),
});

export default BlogValidator;
