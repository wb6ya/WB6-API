import Blog from "#models/Blog.js";
import asyncHandler from "express-async-handler";
import { translateToEnglish, improveArabicText } from "#utils/translate.js";

const createBlog = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path;
    }
    
    const improvedArabic = await improveArabicText(
        req.body.title,
        req.body.description,
        req.body.content
    );

    req.body.title = improvedArabic.title || req.body.title;
    req.body.description = improvedArabic.description || req.body.description;
    req.body.content = improvedArabic.content || req.body.content;

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
        
        const improvedArabic = await improveArabicText(titleToProcess, descToProcess, contentToProcess);

        if (improvedArabic.title) req.body.title = improvedArabic.title;
        if (improvedArabic.description) req.body.description = improvedArabic.description;
        if (improvedArabic.content) req.body.content = improvedArabic.content;

        const { titleEn, descriptionEn, contentEn } = await translateToEnglish(
            req.body.title || blog.title, 
            req.body.description || blog.description, 
            req.body.content || blog.content
        );
        
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

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };