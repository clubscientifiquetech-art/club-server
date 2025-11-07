import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);

  res.json({ token });
};
