const express = require("express");
const { registerDefinition } = require("swaggiffy");
const {
  getAllBookings,
  getBooking,
  createBooking,
  rejectBooking,
  approveBooking,
} = require("../controllers/bookings.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllBookings);
router.get("/:id", protect, getBooking);
router.post("/", protect, createBooking);
router.put("/:id/reject", protect, rejectBooking);
router.put("/:id/approve", protect, approveBooking);

registerDefinition(router, {
  tags: "Bookings",
  mappedSchema: "Booking",
  basePath: "/api/v1/bookings",
});

module.exports = router;
