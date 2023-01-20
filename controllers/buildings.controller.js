const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Building = require("../models/Building");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const Place = require("../models/Place");

module.exports.getAllBuildings = asyncHandler(async (req, res, next) => {
  const buildings = await Building.find();

  if (buildings) {
    return res.status(200).json({
      success: true,
      data: buildings,
    });
  } else {
    return next(new ErrorResponse("Error fetching buildings", 500));
  }
});

module.exports.getBuilding = asyncHandler(async (req, res, next) => {
  const building = await Building.findById(req.params.id);

  if (building) {
    return res.status(200).json({
      success: true,
      data: building,
    });
  } else {
    return next(new ErrorResponse("Error fetching building", 500));
  }
});

module.exports.createBuilding = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = await uploadToCloudinary(
      req.file.path,
      "meeting-room/buildings"
    );
  }

  const building = await Building.create(req.body);

  if (building) {
    return res.status(201).json({
      success: true,
      data: building,
    });
  } else {
    return next(new ErrorResponse("Error creating building", 500));
  }
});

module.exports.updateBuilding = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = await uploadToCloudinary(
      req.file.path,
      "meeting-room/buildings"
    );
  }

  const building = await Building.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (building) {
    return res.status(200).json({
      success: true,
      data: building,
    });
  } else {
    return next(new ErrorResponse("Error updating building", 500));
  }
});

module.exports.deleteBuilding = asyncHandler(async (req, res, next) => {
  const places = await Place.find({ building: req.params.id });

  if (places.length > 0) {
    return next(new ErrorResponse("Cannot delete building with places", 500));
  }

  const building = await Building.findByIdAndDelete(req.params.id);

  if (building) {
    return res.status(200).json({
      success: true,
      data: building,
    });
  } else {
    return next(new ErrorResponse("Error deleting building", 500));
  }
});
