const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute=require("./routes/authRoutes")

dotenv.config();

const app = express();

const appointmentRoutes = require("./routes/appointmentRoutes");



// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/appointments", appointmentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("MedQueue API Running...");
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 3000, () =>
      console.log("Server running...")
    );
  })
  .catch(err => console.log(err));
