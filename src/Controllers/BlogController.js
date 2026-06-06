import Blog from "#models/Blog.js";
import asyncHandler from "express-async-handler";

const createBlog = asyncHandler(async (req, res) => {
    // Add the logged-in user's ID as the author automatically
    const blogData = { ...req.body, author: req.user._id };
    const blog = await Blog.create(blogData);
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

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Check Authorization: only the author can delete their blog
    if (blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this blog");
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };