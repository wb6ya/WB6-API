import Blog from "#models/Blog.js";
import asyncHandler from "express-async-handler";
import { translateToEnglish } from "#utils/translate.js";

const createBlog = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path; // Cloudinary URL
    }
    
    // Translate to English
    const { titleEn, descriptionEn, contentEn } = await translateToEnglish(
        req.body.title, 
        req.body.description, 
        req.body.content
    );
    
    const blogData = {
        ...req.body,
        titleEn,
        descriptionEn,
        contentEn,
        author: req.user._id
    };

    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
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
    const blog = await Blog.findById(req.params.id);
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

    // Check Authorization: only the author can update their blog (if author exists)
    if (blog.author && req.user && blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this blog");
    }

    if (req.file) {
        req.body.image = req.file.path;
    }

    if (req.body.title || req.body.description || req.body.content) {
        const titleToTranslate = req.body.title || blog.title;
        const descToTranslate = req.body.description || blog.description;
        const contentToTranslate = req.body.content || blog.content;
        
        const { titleEn, descriptionEn, contentEn } = await translateToEnglish(titleToTranslate, descToTranslate, contentToTranslate);
        
        if (titleEn) req.body.titleEn = titleEn;
        if (descriptionEn) req.body.descriptionEn = descriptionEn;
        if (contentEn) req.body.contentEn = contentEn;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Check Authorization is no longer strictly necessary here because
    // the route is protected by `admin` middleware now. 
    // Only admins can delete. But keeping it as an extra check is fine.

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };