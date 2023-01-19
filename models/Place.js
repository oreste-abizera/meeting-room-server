const mongoose = require("mongoose");
const { registerSchema } = require("swaggiffy");

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name should be at least 3 characters"],
      maxlength: [255, "Name should not be greater than 255 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [3, "Location should be at least 3 characters"],
      maxlength: [255, "Location should not be greater than 255 characters"],
    },
    floor: {
      type: Number,
      required: [true, "Floor is required"],
      min: [1, "Floor should be at least 1"],
    },
    images: {
      type: [
        {
          image_url: String,
          public_id: String,
        },
      ],
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: [true, "Building is required"],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

registerSchema("Place", PlaceSchema, {
  orm: "mongoose",
});

module.exports = mongoose.model("Place", PlaceSchema);
