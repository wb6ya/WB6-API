// @ts-nocheck
import Subscriber from "../Models/Subscriber.js";
import asyncHandler from "express-async-handler";

// @desc    Add a new subscriber
// @route   POST /api/subscribers
// @access  Public
const addSubscriber = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("يرجى إدخال البريد الإلكتروني");
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
        res.status(400);
        throw new Error("هذا البريد الإلكتروني مشترك مسبقاً");
    }

    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
        success: true,
        message: "تم الاشتراك بنجاح",
        data: subscriber
    });
});

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: subscribers
    });
});

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private/Admin
const deleteSubscriber = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
        res.status(404);
        throw new Error("المشترك غير موجود");
    }

    res.status(200).json({
        success: true,
        message: "تم حذف المشترك بنجاح"
    });
});

export { addSubscriber, getSubscribers, deleteSubscriber };
