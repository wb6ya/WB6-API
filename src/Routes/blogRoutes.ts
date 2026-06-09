import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getRelatedBlogs, incrementView, incrementLike, getSitemapData, getBlogStats, addComment, getComments, deleteComment } from "../Controllers/BlogController.js";
import BlogValidator from "../Utils/Validators/BlogValidator.js";
import validate from "../Middleware/validate.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import upload from "../Utils/upload.js";

const router = Router();

router.post("/", protect, upload.single("image"), validate(BlogValidator), createBlog);
router.get("/sitemap", getSitemapData);
router.get("/stats", protect, admin, getBlogStats);
router.get("/", getAllBlogs);
router.get("/:id/related", getRelatedBlogs);
router.get("/:id/comments", getComments);
router.post("/:id/comment", addComment);
router.delete("/comment/:id", protect, admin, deleteComment);
router.get("/:id", getBlogById);
router.post("/:id/view", incrementView);
router.post("/:id/like", incrementLike);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

export default router;
