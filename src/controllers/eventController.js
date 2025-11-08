import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { activity, title, description, date, location, memberLimit } =
      req.body;

    const event = new Event({
      activity,
      title,
      description,
      date,
      location,
      memberLimit,
    });

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
    res.status(200).json({ message: `Event(${id}) deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const memberId = req.user?.id;
    if (!memberId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Member ID missing" });
    }

    if (event.members.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "You have already joined this event" });
    }

    if (event.members.length >= event.memberLimit) {
      return res.status(403).json({ message: "Event is full" });
    }

    event.members.push(memberId);
    await event.save();

    res.status(200).json({ message: "Successfully joined the event", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
