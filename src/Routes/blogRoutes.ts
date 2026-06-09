import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getRelatedBlogs, incrementView, incrementLike } from "../Controllers/BlogController.js";
import BlogValidator from "../Utils/Validators/BlogValidator.js";
import validate from "../Middleware/validate.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import upload from "../Utils/upload.js";

const router = Router();

router.post("/", protect, upload.single("image"), validate(BlogValidator), createBlog);
router.get("/", getAllBlogs);
router.get("/:id/related", getRelatedBlogs);
router.get("/:id", getBlogById);
router.post("/:id/view", incrementView);
router.post("/:id/like", incrementLike);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

export default router;
