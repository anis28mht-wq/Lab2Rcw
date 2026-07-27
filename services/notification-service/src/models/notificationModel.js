import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true, default: "INFO" },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
