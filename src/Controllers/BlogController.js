import Blog from "#models/Blog.js";
import asyncHandler from "express-async-handler";

const createBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.create(req.body);
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
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };