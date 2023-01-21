const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, companyName, country, password } =
    req.body;

  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    return next(
      new ErrorResponse(`User with email ${email} already exists`, 400)
    );
  }

  let user = await User.create({
    firstName,
    lastName,
    email,
    companyName,
    country,
    password,
  });

  if (user) {
    return res.status(201).json({
      success: true,
      data: user,
    });
  } else {
    return next(new ErrorResponse("Error creating user", 500));
  }
});

module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorResponse(`User with email ${email} does not exist`, 400)
    );
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const token = user.getSignedJwtToken();
  return res.status(200).json({
    success: true,
    token,
    data: user,
  });
});

module.exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user) {
    return res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    return next(new ErrorResponse("Error fetching user", 500));
  }
});

module.exports.updateMe = asyncHandler(async (req, res, next) => {
  if (req.body.password) {
    return next(new ErrorResponse("Cannot update password", 400));
  }

  if (req.file) {
    req.body.profilePicture = await uploadToCloudinary(
      req.file.path,
      "meeting-room/users-profiles"
    );
  }
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (user) {
    return res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    return next(new ErrorResponse("Error updating user", 500));
  }
});
