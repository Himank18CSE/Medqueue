const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getMyDoctorProfile
} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllDoctors);
router.get("/me", authMiddleware, getMyDoctorProfile);

module.exports = router;
