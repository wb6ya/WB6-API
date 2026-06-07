import Tag from "#models/Tag.js";
import asyncHandler from "express-async-handler";

const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.status(200).json(tags);
});

const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        res.status(400);
        throw new Error("Tag name is required");
    }

    const tagExists = await Tag.findOne({ name });
    if (tagExists) {
        res.status(400);
        throw new Error("Tag already exists");
    }

    const tag = await Tag.create({ name });
    res.status(201).json(tag);
});

const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
        res.status(404);
        throw new Error("Tag not found");
    }

    await Tag.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Tag deleted successfully" });
});

export { getTags, createTag, deleteTag };
