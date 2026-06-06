import { Router } from "express";
import { registerUser, loginUser, setupAdmin } from "#controllers/AuthController.js";
import { protect, admin } from "#middleware/authMiddleware.js";

const router = Router();

router.post("/setup-admin", setupAdmin); // متاح فقط إذا لم يكن هناك أي مستخدم
router.post("/register", protect, admin, registerUser);
router.post("/login",loginUser);

export default router;
