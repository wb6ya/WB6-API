import Blog from "#models/Blog.js";
import asyncHandler from "express-async-handler";

const createBlog = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path; // Cloudinary URL
    }
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
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

    // Check Authorization: only the author can update their blog
    if (blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this blog");
    }

    if (req.file) {
        req.body.image = req.file.path;
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