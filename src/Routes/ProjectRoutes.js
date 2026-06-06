import { Router } from "express";
import validate from "#middleware/validate.js";
import projectValidator from "#Utils/Validators/ProjectsValidator.js";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "#controllers/ProjectController.js";
import protect from "#middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, validate(projectValidator), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
