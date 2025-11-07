import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  activities: {
    type: [
      {
        type: String,
        enum: ["chess", "innovation", "robotic"],
      },
    ],
    validate: {
      validator: (arr) => arr.length >= 1 && arr.length <= 3,
      message: "Activities must have between 1 and 3 items.",
    },
    default: [],
  },
  message: String,
});

export default mongoose.model("Member", memberSchema);
