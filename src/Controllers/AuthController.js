import User from "#models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "#utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    
    const userExists = await User.findOne({ email: String(email) });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    
    const finalUsername = String(username || email.split('@')[0]);
    
    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) {
        res.status(400);
        throw new Error("Username already taken");
    }
    
    const user = await User.create({ email: String(email), password: String(password), username: finalUsername });
    res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: String(email) });
    if (user && await user.matchPassword(String(password))) {
        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const setupAdmin = async (req, res) => {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
        res.status(403);
        throw new Error("Admin is already setup. Use /register if you are an admin.");
    }
    
    const { email, password, username } = req.body;
    
    const finalUsername = String(username || email.split('@')[0]);
    const user = await User.create({ email: String(email), password: String(password), username: finalUsername, role: 'admin' });
    res.status(200).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    });
};

const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (req.body.username) {
        user.username = String(req.body.username);
    }
    if (req.file) {
        user.avatar = req.file.path;
    }

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
    });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (req.body.username) user.username = String(req.body.username);
    if (req.file) user.avatar = req.file.path;

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role
    });
});

export { registerUser, loginUser, setupAdmin, updateProfile, getAllUsers, updateUser };

