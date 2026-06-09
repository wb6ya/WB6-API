import { Router } from "express";
import { addSubscriber, getSubscribers, deleteSubscriber } from "../Controllers/SubscriberController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = Router();

router.post("/", addSubscriber);
router.get("/", protect, admin, getSubscribers);
router.delete("/:id", protect, admin, deleteSubscriber);

export default router;
