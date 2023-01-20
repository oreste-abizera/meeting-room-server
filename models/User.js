const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema } = require("swaggiffy");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name should be at least 3 characters"],
      maxlength: [255, "First name should not be greater than 255 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [3, "Last name should be at least 3 characters"],
      maxlength: [255, "Last name should not be greater than 255 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: 3,
      maxlength: 255,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      minlength: [3, "Company name should be at least 3 characters"],
      maxlength: [
        255,
        "Company name should not be greater than 255 characters",
      ],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      minlength: [3, "Country should be at least 3 characters"],
      maxlength: [255, "Country should not be greater than 255 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters"],
      maxlength: [255, "Password should not be greater than 255 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

registerSchema("User", UserSchema, { orm: "mongoose" });

module.exports = mongoose.model("User", UserSchema);
