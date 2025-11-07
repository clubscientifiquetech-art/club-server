import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/members", memberRoutes);

export default app;
