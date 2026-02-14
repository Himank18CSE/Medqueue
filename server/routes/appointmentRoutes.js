const express = require("express");
const router = express.Router();
const { bookAppointment } = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const { getDoctorQueue } = require("../controllers/appointmentController");

router.get("/queue/:doctorId", getDoctorQueue);

router.post("/book", authMiddleware, bookAppointment);

module.exports = router;
