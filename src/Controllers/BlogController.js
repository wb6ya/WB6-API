import Blog from "#models/Blog.js";
import asyncHandler from "express-async-handler";
import { translateToEnglish, improveArabicText } from "#utils/translate.js";
import { generateAndUploadImage } from "#utils/aiImage.js";
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path;
    }
    
    let improvedArabic = { title: req.body.title, description: req.body.description, content: req.body.content };
    try {
        const result = await improveArabicText(req.body.title, req.body.description, req.body.content);
        if (result) improvedArabic = { ...improvedArabic, ...result };
    } catch (err) {
        console.warn("AI Text Improvement failed, using original text:", err.message);
    }

    req.body.title = improvedArabic.title;
    req.body.description = improvedArabic.description;
    req.body.content = improvedArabic.content;

    let titleEn = "", descriptionEn = "", contentEn = "";
    try {
        const result = await translateToEnglish(req.body.title, req.body.description, req.body.content);
        if (result) {
            titleEn = result.titleEn;
            descriptionEn = result.descriptionEn;
            contentEn = result.contentEn;
        }
    } catch (err) {
        console.warn("AI Translation failed, leaving English fields empty:", err.message);
    }
    
    let parsedTags = [];
    if (req.body.tags) {
        try { parsedTags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags; }
        catch (e) { parsedTags = []; }
    }

    const aiIconUrl = await generateAndUploadImage(titleEn || req.body.title, descriptionEn || req.body.description);
    if (aiIconUrl) {
        req.body.icon = aiIconUrl;
    }

    // Generate the exact link format based on the user's website structure
    const blogId = new mongoose.Types.ObjectId();
    const link = `https://blog.wb6ya.com/ar/blog/${blogId}`;

    const blogData = {
        _id: blogId,
        ...req.body,
        titleEn,
        descriptionEn,
        contentEn,
        tags: parsedTags,
        author: req.user._id,
        link
    };

    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
        // Prevent ReDoS by escaping regex special characters
        const safeSearch = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
            { title: { $regex: safeSearch, $options: 'i' } },
            { description: { $regex: safeSearch, $options: 'i' } },
            { titleEn: { $regex: safeSearch, $options: 'i' } },
            { descriptionEn: { $regex: safeSearch, $options: 'i' } },
        ];
    }
    if (req.query.tag) {
        // Cast to string to prevent NoSQL object injection
        filter.tags = String(req.query.tag);
    }

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    res.status(200).json({
        blogs,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
    });
});

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author', 'username avatar');
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    if (blog.author && req.user && blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this blog");
    }

    if (req.file) {
        req.body.image = req.file.path;
    }

    if (req.body.title || req.body.description || req.body.content) {
        const titleToProcess = req.body.title || blog.title;
        const descToProcess = req.body.description || blog.description;
        const contentToProcess = req.body.content || blog.content;
        
        try {
            const improvedArabic = await improveArabicText(titleToProcess, descToProcess, contentToProcess);
            if (improvedArabic.title) req.body.title = improvedArabic.title;
            if (improvedArabic.description) req.body.description = improvedArabic.description;
            if (improvedArabic.content) req.body.content = improvedArabic.content;
        } catch (err) {
            console.warn("AI Text Improvement failed during update:", err.message);
        }

        try {
            const { titleEn, descriptionEn, contentEn } = await translateToEnglish(
                req.body.title || blog.title, 
                req.body.description || blog.description, 
                req.body.content || blog.content
            );
            
            if (titleEn) req.body.titleEn = titleEn;
            if (descriptionEn) req.body.descriptionEn = descriptionEn;
            if (contentEn) req.body.contentEn = contentEn;
        } catch (err) {
            console.warn("AI Translation failed during update:", err.message);
        }
    }

    if (req.body.tags) {
        try { req.body.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags; }
        catch (e) {}
    }

    // Prevent Mass Assignment vulnerability
    const allowedBlogUpdates = ['title', 'description', 'content', 'titleEn', 'descriptionEn', 'contentEn', 'image', 'tags'];
    const updateData = {};
    allowedBlogUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };