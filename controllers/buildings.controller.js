const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Building = require("../models/Building");

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
