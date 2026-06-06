import Project from "#models/Projects.js";
import asyncHandler from "express-async-handler";

const createProject = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path; // Cloudinary URL
    }
    const project = await Project.create({ ...req.body, author: req.user._id });
    res.status(201).json(project);
});

const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find();
    res.status(200).json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    res.status(200).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    
    if (req.file) {
        req.body.image = req.file.path;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    await project.deleteOne();
    res.status(200).json({ message: "Project removed" });
});

export { createProject, getAllProjects, getProjectById, updateProject, deleteProject };