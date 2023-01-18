const mongoose = require("mongoose");
const { registerSchema } = require("swaggiffy");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: [true, "Place is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End Time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

registerSchema("Booking", BookingSchema, {
  orm: "mongoose",
});

module.exports = mongoose.model("Booking", BookingSchema);
