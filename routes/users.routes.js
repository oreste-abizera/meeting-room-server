const express = require("express");
const { registerDefinition } = require("swaggiffy");
const { getAllUsers } = require("../controllers/users.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAllUsers);

registerDefinition(router, {
  tags: "Users",
  mappedSchema: "User",
  basePath: "/api/v1/users",
});

module.exports = router;
