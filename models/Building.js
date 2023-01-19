const mongoose = require("mongoose");
const { registerSchema } = require("swaggiffy");

const BuildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name should be at least 3 characters"],
      maxlength: [255, "Name should not be greater than 255 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [3, "Address should be at least 3 characters"],
      maxlength: [255, "Address should not be greater than 255 characters"],
    },
    floors: {
      type: Number,
      required: [true, "Floors is required"],
      min: [1, "Floors should be at least 1"],
    },
    image: {
      type: {
        image_url: String,
        public_id: String,
      },
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

registerSchema("Building", BuildingSchema, {
  orm: "mongoose",
});

module.exports = mongoose.model("Building", BuildingSchema);
