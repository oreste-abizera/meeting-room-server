const express = require("express");
const { registerDefinition } = require("swaggiffy");
const {
  getAllPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllPlaces);
router.get("/:id", protect, getPlace);
router.post("/", protect, createPlace);
router.put("/:id", protect, updatePlace);
router.delete("/:id", protect, deletePlace);

registerDefinition(router, {
  tags: "Places",
  mappedSchema: "Place",
  basePath: "/api/v1/places",
});

module.exports = router;
