const express = require("express");
const { registerDefinition } = require("swaggiffy");
const {
  getAllBuildings,
  getBuilding,
} = require("../controllers/buildings.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllBuildings);
router.get("/:id", protect, getBuilding);

registerDefinition(router, {
  tags: "Buildings",
  mappedSchema: "Building",
  basePath: "/api/v1/buildings",
});

module.exports = router;
