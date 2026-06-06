import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "#controllers/BlogController.js";
import BlogValidator from "#utils/Validators/BlogValidator.js";
import validate from "#middleware/validate.js";
import protect from "#middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, validate(BlogValidator), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
