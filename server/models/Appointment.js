const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  tokenNumber: Number,
  priority: {
    type: String,
    enum: ["normal", "emergency"],
    default: "normal"
  },
  status: {
    type: String,
    enum: ["waiting", "ongoing", "completed","cancelled"],
    default: "waiting"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);

