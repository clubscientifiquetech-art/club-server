import express from "express";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getAllMembers,
  registerMember,
  removeMember,
  loginMember,
  verifyMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/", getAllMembers);
router.post("/", registerMember);
router.post("/login", loginMember);
router.post("/verify/:id", authMiddleware, adminOnly, verifyMember);
router.delete("/:id", authMiddleware, adminOnly, removeMember);

export default router;
