import Member from "../models/Member.js";

export const getMembers = async (req, res) => {
  const members = await Member.find();
  res.json(members);
};

export const createMember = async (req, res) => {
  try {
    const { username, email, phone, activities, message } = req.body;

    const member = new Member({ username, email, phone, activities, message });
    await member.save();

    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.deleteOne({ _id: id });
    res.status(200).json({ message: `Member(${id}) deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
