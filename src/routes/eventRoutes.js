import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getEvents,
  createEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// Configure multer to save files in uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads"); // folder path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  },
});

const upload = multer({ storage });

router.get("/", getEvents);
router.post("/create", authMiddleware, upload.single("image"), createEvent);
router.delete("/delete:id", authMiddleware, deleteEvent);

export default router;
