const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (users) {
    users.forEach((user) => {
      user.password = undefined;
    });
    return res.status(200).json({
      success: true,
      data: users,
    });
  } else {
    return next(new ErrorResponse("Error fetching users", 500));
  }
});
