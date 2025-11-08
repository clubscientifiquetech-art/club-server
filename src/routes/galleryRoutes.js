import express from "express";
import multer from "multer";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createGallery,
  uploadImages,
  deleteGallery,
  deleteImages,
  getGallery,
} from "../controllers/galleryController.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadMiddleware = multer({ storage });

// Routes
router.get("/", getGallery);
router.post("/", authMiddleware, adminOnly, createGallery);
router.post(
  "/upload/:id",
  authMiddleware,
  adminOnly,
  uploadMiddleware.array("files"), // use .single("file") for single upload
  uploadImages
);
router.delete("/:id", authMiddleware, adminOnly, deleteGallery);
router.delete("/images/:id", authMiddleware, adminOnly, deleteImages);

export default router;
