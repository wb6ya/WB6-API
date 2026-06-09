// @ts-nocheck
import Blog from "../Models/Blog.js";
import asyncHandler from "express-async-handler";
import { translateToEnglish, improveArabicText, AIError } from "../Utils/translate.js";
import { generateAndUploadImage } from "../Utils/aiImage.js";
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path;
    }
    
    // الخطوة 1: تحسين النص العربي (اختياري بناءً على طلب المستخدم)
    const enhanceWithAI = req.body.enhanceWithAI === 'true' || req.body.enhanceWithAI === true;
    
    if (enhanceWithAI) {
        let improvedArabic;
        try {
            improvedArabic = await improveArabicText(req.body.title, req.body.description, req.body.content);
        } catch (err) {
            const message = err instanceof AIError 
                ? `فشل في مرحلة "${err.step}": ${err.message}` 
                : `فشل تحسين النص العربي: ${err.message}`;
            res.status(502);
            throw new Error(message);
        }

        req.body.title = improvedArabic.title;
        req.body.description = improvedArabic.description;
        req.body.content = improvedArabic.content;
    }

    // الخطوة 2: الترجمة للإنجليزية (إجباري - يوقف الإنشاء عند الفشل)
    let titleEn, descriptionEn, contentEn;
    try {
        const result = await translateToEnglish(req.body.title, req.body.description, req.body.content);
        titleEn = result.titleEn;
        descriptionEn = result.descriptionEn;
        contentEn = result.contentEn;
    } catch (err) {
        const message = err instanceof AIError 
            ? `فشل في مرحلة "${err.step}": ${err.message}` 
            : `فشل الترجمة للإنجليزية: ${err.message}`;
        res.status(502);
        throw new Error(message);
    }
    
    // الخطوة 3: تحليل التاغات
    let parsedTags = [];
    if (req.body.tags) {
        try { parsedTags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags; }
        catch (e) { parsedTags = []; }
    }

    // الخطوة 4: إنشاء صورة AI (إجباري - يوقف الإنشاء عند الفشل)
    let aiIconUrl;
    try {
        aiIconUrl = await generateAndUploadImage(titleEn || req.body.title, descriptionEn || req.body.description);
    } catch (err) {
        const message = err instanceof AIError 
            ? `فشل في مرحلة "${err.step}": ${err.message}` 
            : `فشل إنشاء الصورة: ${err.message}`;
        res.status(502);
        throw new Error(message);
    }

    const blogId = new mongoose.Types.ObjectId();
    const link = `https://blog.wb6ya.com/ar/blog/${blogId}`;

    const blogData = {
        _id: blogId,
        ...req.body,
        titleEn,
        descriptionEn,
        contentEn,
        tags: parsedTags,
        icon: aiIconUrl,
        author: req.user._id,
        link
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
        success: true,
        message: "تم إنشاء المقال بنجاح",
        data: blog,
    });
});

const getAllBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
        const safeSearch = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
            { title: { $regex: safeSearch, $options: 'i' } },
            { description: { $regex: safeSearch, $options: 'i' } },
            { titleEn: { $regex: safeSearch, $options: 'i' } },
            { descriptionEn: { $regex: safeSearch, $options: 'i' } },
        ];
    }
    if (req.query.tag) {
        filter.tags = String(req.query.tag);
    }

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    res.status(200).json({
        success: true,
        message: "تم جلب المقالات بنجاح",
        data: blogs,
        blogs, // backward compatibility
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
    });
});

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author', 'username avatar');
    if (!blog) {
        res.status(404);
        throw new Error("المقال غير موجود");
    }
    res.status(200).json({
        success: true,
        message: "تم جلب المقال بنجاح",
        data: blog,
        ...blog.toObject(), // backward compatibility
    });
});

const updateBlog = asyncHandler(async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
        res.status(404);
        throw new Error("المقال غير موجود");
    }

    if (blog.author && req.user && blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("غير مصرح لك بتعديل هذا المقال");
    }

    if (req.file) {
        req.body.image = req.file.path;
    }

    if (req.body.title || req.body.description || req.body.content) {
        const titleToProcess = req.body.title || blog.title;
        const descToProcess = req.body.description || blog.description;
        const contentToProcess = req.body.content || blog.content;
        
        // تحسين النص العربي (اختياري عند التعديل)
        const enhanceWithAI = req.body.enhanceWithAI === 'true' || req.body.enhanceWithAI === true;
        
        if (enhanceWithAI) {
            try {
                const improvedArabic = await improveArabicText(titleToProcess, descToProcess, contentToProcess);
                if (improvedArabic.title) req.body.title = improvedArabic.title;
                if (improvedArabic.description) req.body.description = improvedArabic.description;
                if (improvedArabic.content) req.body.content = improvedArabic.content;
            } catch (err) {
                const message = err instanceof AIError 
                    ? `فشل في مرحلة "${err.step}": ${err.message}` 
                    : `فشل تحسين النص العربي: ${err.message}`;
                res.status(502);
                throw new Error(message);
            }
        }

        // الترجمة للإنجليزية (إجباري عند التعديل)
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
            const message = err instanceof AIError 
                ? `فشل في مرحلة "${err.step}": ${err.message}` 
                : `فشل الترجمة للإنجليزية: ${err.message}`;
            res.status(502);
            throw new Error(message);
        }
    }

    if (req.body.tags) {
        try { req.body.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags; }
        catch (e) {}
    }

    const allowedBlogUpdates = ['title', 'description', 'content', 'titleEn', 'descriptionEn', 'contentEn', 'image', 'tags'];
    const updateData = {};
    allowedBlogUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    res.status(200).json({
        success: true,
        message: "تم تحديث المقال بنجاح",
        data: blog,
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
        res.status(404);
        throw new Error("المقال غير موجود");
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
        success: true, 
        message: "تم حذف المقال بنجاح" 
    });
});

const getRelatedBlogs = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error("المقال غير موجود");
    }

    let relatedBlogs = [];
    if (blog.tags && blog.tags.length > 0) {
        relatedBlogs = await Blog.find({
            _id: { $ne: blog._id },
            tags: { $in: blog.tags }
        })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(3);
    }

    // إذا لم نجد مقالات لها نفس الوسوم (أو إذا كان المقال بلا وسوم)، نجلب أحدث المقالات
    if (relatedBlogs.length < 3) {
        const excludeIds = [blog._id, ...relatedBlogs.map(b => b._id)];
        const latestBlogs = await Blog.find({ _id: { $nin: excludeIds } })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(3 - relatedBlogs.length);
        
        relatedBlogs = [...relatedBlogs, ...latestBlogs];
    }

    res.status(200).json({
        success: true,
        message: "تم جلب المقالات ذات الصلة",
        data: relatedBlogs,
    });
});

const incrementView = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!blog) {
        res.status(404);
        throw new Error("المقال غير موجود");
    }
    res.status(200).json({ success: true, message: "تم زيادة عدد المشاهدات", views: blog.views });
});

const incrementLike = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!blog) {
        res.status(404);
        throw new Error("المقال غير موجود");
    }
    res.status(200).json({ success: true, message: "تم زيادة عدد الإعجابات", likes: blog.likes });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getRelatedBlogs, incrementView, incrementLike };
