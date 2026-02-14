const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, priority } = req.body;

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Count existing appointments for that doctor (today logic skip for now)
    const count = await Appointment.countDocuments({ doctorId });

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      tokenNumber: count + 1,
      priority: priority || "normal"
    });

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await Appointment.find({
      doctorId,
      status: "waiting"
    })
      .sort({ priority: -1, tokenNumber: 1 });

    const queueWithETA = appointments.map((appt, index) => {
      return {
        ...appt._doc,
        position: index + 1,
        estimatedWaitTime: index * doctor.avgConsultTime
      };
    });

    res.json(queueWithETA);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

