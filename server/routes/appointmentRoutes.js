const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getDoctorQueue,
  callNextPatient,
  getMyAppointment,
  cancelAppointment,
  getDoctorStats
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/book", authMiddleware, bookAppointment);
router.get("/queue/:doctorId", getDoctorQueue);
router.put("/next/:doctorId", callNextPatient);
router.put("/cancel", authMiddleware, cancelAppointment);
router.get("/my", authMiddleware, getMyAppointment);
router.get("/stats/:doctorId", getDoctorStats);




module.exports = router;

