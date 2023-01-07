const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.log("MongoDB connection error");
    });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
