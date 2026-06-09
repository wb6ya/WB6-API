import { Router } from "express";
import validate from "../Middleware/validate.js";
import projectValidator from "../Utils/Validators/ProjectValidator.js";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../Controllers/ProjectController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import upload from "../Utils/upload.js";

const router = Router();

router.post("/", protect, upload.single("image"), validate(projectValidator), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, admin, deleteProject);

export default router;
