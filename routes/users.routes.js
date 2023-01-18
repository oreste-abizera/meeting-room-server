const express = require("express");
const { registerDefinition } = require("swaggiffy");
const { getAllUsers, getUser } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUser);

registerDefinition(router, {
  tags: "Users",
  mappedSchema: "User",
  basePath: "/api/v1/users",
});

module.exports = router;
