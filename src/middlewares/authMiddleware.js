import jwt from "jsonwebtoken";
import Member from "../models/Member.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // verify user still exists
    const member = await Member.findById(decoded.id);
    if (!member) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Attach full user info to the request
    req.user = { id: member._id, username: member.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};
