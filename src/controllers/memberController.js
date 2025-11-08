import jwt from "jsonwebtoken";
import Member from "../models/Member.js";

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({}, { password: 0 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerMember = async (req, res) => {
  try {
    const { username, cni, email, phone, password } = req.body;

    const existing = await Member.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username already exists" });

    const member = new Member({ username, cni, email, phone, password });
    await member.save();

    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.deleteOne({ _id: id });
    res.status(200).json({ message: `Member(${id}) deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { username, password } = req.body;
    const member = await Member.findOne({ username });
    if (!member)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await member.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: member._id, role: "member" },
      process.env.JWT_SECRET
    );
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) return res.status(400).json({ message: "Invalid member ID" });

    if (member.verified)
      return res.status(400).json({ message: "Member is already verified" });

    member.verified = true;
    await member.save();

    res.status(200).json({ message: `Member(${id}) verified successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
