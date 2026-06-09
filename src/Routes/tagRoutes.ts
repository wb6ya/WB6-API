import { Router } from "express";
import { getTags, createTag, deleteTag } from "../Controllers/TagController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = Router();

router.route("/")
    .get(getTags)
    .post(protect, admin, createTag);

router.route("/:id")
    .delete(protect, admin, deleteTag);

export default router;
