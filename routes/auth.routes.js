const express = require("express");
const { registerDefinition } = require("swaggiffy");
const {
  register,
  login,
  getMe,
  updateMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

registerDefinition(router, {
  tags: "Auth",
  mappedSchema: "User",
  basePath: "/api/v1/auth",
});

module.exports = router;
