import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  activity: {
    type: String,
    enum: ["Échecs", "Robotique", "Prix du meilleur TIPE"],
    required: true,
  },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  images: { type: [String], default: [] },
  thumbnail: {
    type: String,
    default: function () {
      return this.images.length > 0 ? this.images[0] : undefined;
    },
  },
});

gallerySchema.pre("save", function (next) {
  if (!this.thumbnail && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

export default mongoose.model("Gallery", gallerySchema);
