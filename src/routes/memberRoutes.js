import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getMembers,
  createMember,
  deleteMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/", getMembers);
router.post("/create", authMiddleware, createMember);
router.delete("/delete:id", authMiddleware, deleteMember);

export default router;
