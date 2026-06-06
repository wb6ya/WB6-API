import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "#controllers/BlogController.js";
import BlogValidator from "#utils/Validators/BlogValidator.js";
import validate from "#middleware/validate.js";

const router = Router();

router.post("/", validate(BlogValidator), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
