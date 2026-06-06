import Project from "#models/Projects.js";
import asyncHandler from "express-async-handler";

const createProject = asyncHandler(async (req, res) => {
    const { title, description, content, image, github_url, live_url } = req.body;
    const project = await Project.create({
        title,
        description,
        content,
        image,
        github_url,
        live_url
    });
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
    const { title, description, content, image, github_url, live_url } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    project.title = title || project.title;
    project.description = description || project.description;
    project.content = content || project.content;
    project.image = image || project.image;
    project.github_url = github_url || project.github_url;
    project.live_url = live_url || project.live_url;
    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    await project.deleteOne()
    res.status(200).json({ message: "Project removed" });
});

export {createProject, getAllProjects, getProjectById, updateProject, deleteProject}