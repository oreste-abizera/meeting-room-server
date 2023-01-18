const { Swaggiffy } = require("swaggiffy");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary");

// import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const buildingRoutes = require("./routes/buildings.routes");
const placeRoutes = require("./routes/places.routes");

//Error Handler middleware
const ErrorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("picture"));

// routes
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the API",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/buildings", buildingRoutes);
app.use("/api/v1/places", placeRoutes);

app.use(ErrorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

new Swaggiffy().setupExpress(app).swaggiffy();
