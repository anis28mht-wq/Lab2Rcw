import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    clientName: { type: String },
    equipmentId: { type: String, required: true },
    equipmentName: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    dailyPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
