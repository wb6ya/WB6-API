import { Router } from "express";
import { registerUser, loginUser, setupAdmin, updateProfile, getAllUsers, updateUser } from "#controllers/AuthController.js";
import { protect, admin } from "#middleware/authMiddleware.js";
import upload from "#utils/upload.js";

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
