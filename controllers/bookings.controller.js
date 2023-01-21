const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

const Booking = require("../models/Booking");
const Place = require("../models/Place");
const User = require("../models/User");
const Building = require("../models/Building");

module.exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find().populate("user place");

  if (bookings) {
    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } else {
    return next(new ErrorResponse("Error fetching bookings", 500));
  }
});

module.exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("user place");

  if (booking) {
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } else {
    return next(new ErrorResponse("Error fetching booking", 500));
  }
});

module.exports.createBooking = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.body.place);

  const newBookingStart = new Date(req.body.startTime);
  const newBookingEnd = new Date(req.body.endTime);
  const now = new Date();
  if (newBookingStart < now || newBookingEnd < now) {
    return next(new ErrorResponse("Booking time cannot be in the past", 400));
  }

  if (place) {
    const bookings = await Booking.find({
      place: req.body.place,
      status: "approved",
    });
    const isAvailable = bookings.every((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (
        (newBookingStart < bookingStart && newBookingEnd < bookingStart) ||
        (newBookingStart > bookingEnd && newBookingEnd > bookingEnd)
      );
    });
    if (isAvailable) {
      req.body.user = req.user._id;
      const booking = await Booking.create(req.body);
      if (booking) {
        return res.status(201).json({
          success: true,
          data: booking,
        });
      } else {
        return next(new ErrorResponse("Error creating booking", 500));
      }
    } else {
      return next(
        new ErrorResponse("Place not available at the specified time", 400)
      );
    }
  } else {
    return next(new ErrorResponse("Error fetching place", 500));
  }
});

module.exports.rejectBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true, runValidators: true }
  );

  if (booking) {
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } else {
    return next(new ErrorResponse("Error rejecting booking", 500));
  }
});

module.exports.approveBooking = asyncHandler(async (req, res, next) => {
  // Check if the place is available at the specified time
  const bookingToApprove = await Booking.findById(req.params.id).populate(
    "place"
  );
  const place = bookingToApprove.place;
  const bookings = await Booking.find({
    place: place._id,
    status: "approved",
  });

  const newBookingStart = new Date(bookingToApprove.startTime);
  const newBookingEnd = new Date(bookingToApprove.endTime);

  const isAvailable = bookings.every((booking) => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    return (
      (newBookingStart < bookingStart && newBookingEnd < bookingStart) ||
      (newBookingStart > bookingEnd && newBookingEnd > bookingEnd)
    );
  });

  if (!isAvailable) {
    return next(
      new ErrorResponse("Place not available at the specified time", 400)
    );
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true, runValidators: true }
  );

  if (booking) {
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } else {
    return next(new ErrorResponse("Error approving booking", 500));
  }
});

module.exports.getStatistics = asyncHandler(async (req, res, next) => {
  const numberOfBookings = await Booking.countDocuments();
  const numberOfUsers = await User.countDocuments();
  const numberOfPlaces = await Place.countDocuments();
  const numberOfBuildings = await Building.countDocuments();

  const statistics = {
    numberOfBookings,
    numberOfUsers,
    numberOfPlaces,
    numberOfBuildings,
  };

  return res.status(200).json({
    success: true,
    data: statistics,
  });
});
