import fs from "fs";
import Gallery from "../models/Gallery.js";
import { syncUploads } from "../utils/pushUploads.js";

export const createGallery = async (req, res) => {
  try {
    const { activity, title, date } = req.body;
    if (!activity || !title || !date)
      return res
        .status(400)
        .json({ message: "Activity, title, and date are required" });

    const gallery = new Gallery({ activity, title, date });
    await gallery.save();

    res.status(201).json({ message: "Gallery created", gallery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadImages = async (req, res) => {
  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({ message: "No files uploaded" });

  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    files.forEach((file) => gallery.images.push(file.filename));
    if (!gallery.thumbnail) gallery.thumbnail = gallery.images[0];

    await gallery.save();
    await syncUploads();
    res.status(200).json({ message: "Images uploaded", gallery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGallery = async (req, res) => {
  const { id } = req.params;
  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    // Delete images from disk
    gallery.images.forEach((img) => {
      const path = `src/uploads/${img}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });

    await Gallery.deleteOne({ _id: id });
    await syncUploads();
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteImages = async (req, res) => {
  const { id } = req.params;
  const { filenames } = req.body; // expect array of filenames to delete

  if (!filenames || !Array.isArray(filenames) || filenames.length === 0)
    return res.status(400).json({ message: "No filenames provided" });

  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    // Delete files from disk and remove from gallery.images
    filenames.forEach((file) => {
      const path = `src/uploads/${file}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });
    gallery.images = gallery.images.filter((img) => !filenames.includes(img));
    gallery.thumbnail = gallery.images[0] || undefined;

    await gallery.save();
    await syncUploads();
    res.status(200).json({ message: "Images deleted", gallery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
