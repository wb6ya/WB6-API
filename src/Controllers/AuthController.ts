// @ts-nocheck
import User from "../Models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "../Utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    
    const userExists = await User.findOne({ email: String(email) });
    if (userExists) {
        res.status(400);
        throw new Error("هذا البريد الإلكتروني مسجل مسبقاً");
    }
    
    const finalUsername = String(username || email.split('@')[0]);
    
    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) {
        res.status(400);
        throw new Error("اسم المستخدم مأخوذ بالفعل، اختر اسماً آخر");
    }
    
    const user = await User.create({ email: String(email), password: String(password), username: finalUsername });
    res.status(201).json({
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        data: {
            _id: user._id,
            email: user.email,
            username: user.username,
            token: generateToken(user._id)
        }
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400);
        throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    }

    const user = await User.findOne({ email: String(email) });
    if (user && await user.matchPassword(String(password))) {
        res.status(200).json({
            success: true,
            message: "تم تسجيل الدخول بنجاح",
            _id: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
});

const setupAdmin = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
        res.status(403);
        throw new Error("تم إعداد المدير مسبقاً. استخدم /register إذا كنت مديراً.");
    }
    
    const { email, password, username } = req.body;
    
    if (!email || !password) {
        res.status(400);
        throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    }

    const finalUsername = String(username || email.split('@')[0]);
    const user = await User.create({ email: String(email), password: String(password), username: finalUsername, role: 'admin' });
    res.status(201).json({
        success: true,
        message: "تم إنشاء حساب المدير بنجاح",
        data: {
            _id: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
            token: generateToken(user._id)
        }
    });
});

const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("المستخدم غير موجود");
    }

    if (req.body.username) {
        user.username = String(req.body.username);
    }
    if (req.file) {
        user.avatar = req.file.path;
    }

    const updatedUser = await user.save();
    res.status(200).json({
        success: true,
        message: "تم تحديث الملف الشخصي بنجاح",
        data: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        }
    });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json({
        success: true,
        message: "تم جلب قائمة المستخدمين بنجاح",
        data: users,
        total: users.length
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        res.status(404);
        throw new Error("المستخدم غير موجود");
    }

    if (req.body.username) user.username = String(req.body.username);
    if (req.file) user.avatar = req.file.path;

    const updatedUser = await user.save();
    res.status(200).json({
        success: true,
        message: "تم تحديث بيانات المستخدم بنجاح",
        data: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            role: updatedUser.role
        }
    });
});

export { registerUser, loginUser, setupAdmin, updateProfile, getAllUsers, updateUser };
