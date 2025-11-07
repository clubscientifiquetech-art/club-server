import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  const events = await Event.find();
  res.status(200).json(events);
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "Image is required" });

    const imagePath = `/uploads/${file.filename}`;

    const event = new Event({ title, description, date, image: imagePath });
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.deleteOne({ _id: id });
    res.status(200).json({ message: `Member(${id}) deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
