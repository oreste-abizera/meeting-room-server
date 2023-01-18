const express = require("express");
const { registerDefinition } = require("swaggiffy");
const {
  getAllBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} = require("../controllers/buildings.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllBuildings);
router.get("/:id", protect, getBuilding);
router.post("/", protect, createBuilding);
router.put("/:id", protect, updateBuilding);
router.delete("/:id", protect, deleteBuilding);

registerDefinition(router, {
  tags: "Buildings",
  mappedSchema: "Building",
  basePath: "/api/v1/buildings",
});

module.exports = router;
