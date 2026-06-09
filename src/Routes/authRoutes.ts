import { Router } from "express";
import { registerUser, loginUser, setupAdmin, updateProfile, getAllUsers, updateUser } from "../Controllers/AuthController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import upload from "../Utils/upload.js";

const router = Router();

router.post("/setup-admin", setupAdmin);
router.post("/register", protect, admin, registerUser);
router.post("/login",loginUser);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

router.route("/users")
    .get(protect, admin, getAllUsers);

router.route("/users/:id")
    .put(protect, admin, upload.single("avatar"), updateUser);

export default router;
