import { Router } from "express";
import validate from "#middleware/validate.js";
import projectValidator from "#utils/Validators/ProjectsValidator.js";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "#controllers/ProjectController.js";
import { protect, admin } from "#middleware/authMiddleware.js";
import upload from "#utils/upload.js";

const router = Router();

router.post("/", protect, upload.single("image"), validate(projectValidator), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, admin, deleteProject);

export default router;
