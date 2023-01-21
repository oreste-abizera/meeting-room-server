const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const Place = require("../models/Place");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const Booking = require("../models/Booking");

module.exports.getAllPlaces = asyncHandler(async (req, res, next) => {
  const places = await Place.find().populate("building");

  if (places) {
    return res.status(200).json({
      success: true,
      data: places,
    });
  } else {
    return next(new ErrorResponse("Error fetching places", 500));
  }
});

module.exports.getPlace = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id).populate("building");

  if (place) {
    return res.status(200).json({
      success: true,
      data: place,
    });
  } else {
    return next(new ErrorResponse("Error fetching place", 500));
  }
});

module.exports.createPlace = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.images = [
      await uploadToCloudinary(req.file.path, "meeting-room/places"),
    ];
  }

  const place = await Place.create(req.body);

  if (place) {
    return res.status(201).json({
      success: true,
      data: place,
    });
  } else {
    return next(new ErrorResponse("Error creating place", 500));
  }
});

module.exports.updatePlace = asyncHandler(async (req, res, next) => {
  const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (place) {
    return res.status(200).json({
      success: true,
      data: place,
    });
  } else {
    return next(new ErrorResponse("Error updating place", 500));
  }
});

module.exports.deletePlace = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ place: req.params.id });

  if (bookings.length > 0) {
    return next(new ErrorResponse("Cannot delete place with bookings", 400));
  }

  const place = await Place.findByIdAndDelete(req.params.id);

  if (place) {
    return res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    return next(new ErrorResponse("Error deleting place", 500));
  }
});

module.exports.uploadPlaceImages = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id);

  if (place) {
    if (req.files) {
      const images = [];
      req.files.forEach((file) => {
        images.push(uploadToCloudinary(file.path, "meeting-room/places"));
      });

      place.images = place.images.concat(images);
      await place.save();

      return res.status(200).json({
        success: true,
        data: place,
      });
    } else {
      return next(new ErrorResponse("No images uploaded", 400));
    }
  } else {
    return next(new ErrorResponse("Error uploading images", 500));
  }
});
