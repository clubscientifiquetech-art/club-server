import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/admin", adminRoutes);
app.use("/members", memberRoutes);
app.use("/events", eventRoutes);
app.use("/gallery", galleryRoutes);

export default app;
