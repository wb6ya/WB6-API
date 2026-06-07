import { Router } from "express";
import { registerUser, loginUser, setupAdmin, updateProfile } from "#controllers/AuthController.js";
import { protect, admin } from "#middleware/authMiddleware.js";
import upload from "#utils/upload.js";

const router = Router();

router.post("/setup-admin", setupAdmin);
router.post("/register", protect, admin, registerUser);
router.post("/login",loginUser);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
