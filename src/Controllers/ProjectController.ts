// @ts-nocheck
import Project from "#models/Project.js";
import asyncHandler from "express-async-handler";

const createProject = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.image = req.file.path;
    }
    const project = await Project.create({ ...req.body, author: req.user._id });
    res.status(201).json({
        success: true,
        message: "تم إنشاء المشروع بنجاح",
        data: project
    });
});

const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find();
    res.status(200).json({
        success: true,
        message: "تم جلب المشاريع بنجاح",
        data: projects,
        total: projects.length
    });
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("المشروع غير موجود");
    }
    res.status(200).json({
        success: true,
        message: "تم جلب المشروع بنجاح",
        data: project
    });
});

const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("المشروع غير موجود");
    }
    
    if (req.file) {
        req.body.image = req.file.path;
    }

    const allowedProjectUpdates = ['title', 'description', 'content', 'image', 'stack', 'github_url', 'live_url', 'blog_id'];
    const updateData = {};
    allowedProjectUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({
        success: true,
        message: "تم تحديث المشروع بنجاح",
        data: updatedProject
    });
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("المشروع غير موجود");
    }
    await project.deleteOne();
    res.status(200).json({ 
        success: true, 
        message: "تم حذف المشروع بنجاح" 
    });
});

export { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
