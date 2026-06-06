import User from "#models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "#utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    
    const user = await User.create({ email, password });
    res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
        res.status(200).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

export { registerUser, loginUser };

