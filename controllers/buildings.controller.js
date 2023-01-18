const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Building = require("../models/Building");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");

// const dotenv = require("dotenv");
// dotenv.config({ path: "./config/config.env" });

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
  let picture;
  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "meeting-room/buildings",
    });
    picture = {
      image_url: result.url,
      public_id: result.public_id,
    };
    await fs.unlink(req.file.path);
    req.body.image = picture;
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
