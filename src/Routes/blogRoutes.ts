import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getRelatedBlogs } from "#controllers/BlogController.js";
import BlogValidator from "#utils/Validators/BlogValidator.js";
import validate from "#middleware/validate.js";
import { protect, admin } from "#middleware/authMiddleware.js";
import upload from "#utils/upload.js";

const router = Router();

router.post("/", protect, upload.single("image"), validate(BlogValidator), createBlog);
router.get("/", getAllBlogs);
router.get("/:id/related", getRelatedBlogs);
router.get("/:id", getBlogById);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

export default router;
