import express from "express";
import {
  authMiddleware,
  adminOnly,
  loadMember,
} from "../middlewares/authMiddleware.js";
import {
  getEvents,
  createEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", authMiddleware, adminOnly, createEvent);
router.post("/join/:id/:memberId?", authMiddleware, loadMember, joinEvent);
router.post("/leave/:id/:memberId?", authMiddleware, loadMember, leaveEvent);
router.delete("/:id", authMiddleware, adminOnly, deleteEvent);

export default router;
