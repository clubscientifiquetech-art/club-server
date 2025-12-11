import jwt from "jsonwebtoken";
import Member from "../models/Member.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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

export const loadMember = async (req, res, next) => {
  try {
    let memberId =
      req.user.role === "admin" ? req.params?.memberId : req.user?.id;

    if (!memberId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Member ID missing" });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.member = { memberId: member._id, username: member.username };
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
