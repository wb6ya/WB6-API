import Tag from "../Models/Tag.js";
import asyncHandler from "express-async-handler";

const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "تم جلب التاغات بنجاح",
        data: tags,
        total: tags.length
    });
});

const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        res.status(400);
        throw new Error("اسم التاغ مطلوب");
    }

    const tagExists = await Tag.findOne({ name });
    if (tagExists) {
        res.status(400);
        throw new Error("هذا التاغ موجود بالفعل");
    }

    const tag = await Tag.create({ name });
    res.status(201).json({
        success: true,
        message: "تم إنشاء التاغ بنجاح",
        data: tag
    });
});

const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
        res.status(404);
        throw new Error("التاغ غير موجود");
    }

    await Tag.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
        success: true, 
        message: "تم حذف التاغ بنجاح" 
    });
});

export { getTags, createTag, deleteTag };
