const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, priority } = req.body;

    const count = await Appointment.countDocuments({ doctorId });

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      tokenNumber: count + 1,
      priority
    });

    res.status(201).json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    // Only active appointments
    const activeAppointments = await Appointment.find({
      doctorId,
      status: { $in: ["waiting", "ongoing"] }
    });

    // Sort priority + token
    activeAppointments.sort((a, b) => {
      if (a.priority === "emergency" && b.priority !== "emergency") return -1;
      if (a.priority !== "emergency" && b.priority === "emergency") return 1;
      return a.tokenNumber - b.tokenNumber;
    });

    const hasOngoing = activeAppointments.some(
      (a) => a.status === "ongoing"
    );

    let waitingCounter = 0;

    const queue = activeAppointments.map((a) => {
      if (a.status === "ongoing") {
        return {
          ...a._doc,
          position: 1,
          estimatedWaitTime: 0
        };
      }

      // waiting patient
      waitingCounter++;

      const eta = hasOngoing
        ? waitingCounter * doctor.avgConsultTime
        : (waitingCounter - 1) * doctor.avgConsultTime;

      return {
        ...a._doc,
        position: hasOngoing ? waitingCounter + 1 : waitingCounter,
        estimatedWaitTime: eta
      };
    });

    res.json(queue);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.callNextPatient = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // 1️⃣ Find current ongoing patient
    const currentOngoing = await Appointment.findOne({
      doctorId,
      status: "ongoing"
    });

    // 2️⃣ If exists → mark completed
    if (currentOngoing) {
      currentOngoing.status = "completed";
      await currentOngoing.save();
    }

    // 3️⃣ Find next waiting
    const waitingPatients = await Appointment.find({
      doctorId,
      status: "waiting"
    });

    waitingPatients.sort((a, b) => {
      if (a.priority === "emergency" && b.priority !== "emergency") return -1;
      if (a.priority !== "emergency" && b.priority === "emergency") return 1;
      return a.tokenNumber - b.tokenNumber;
    });

    let nextPatient = null;

    if (waitingPatients.length > 0) {
      nextPatient = waitingPatients[0];
      nextPatient.status = "ongoing";
      await nextPatient.save();
    }

    // 🔥 ALWAYS emit
    if (global.io) {
      global.io.emit("queueUpdated");
    }

    res.json({
      message: nextPatient
        ? "Next patient called"
        : "Queue finished",
      patient: nextPatient
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointment = await Appointment.findOne({
      patientId,
      status: { $in: ["waiting", "ongoing"] }
    }).sort({ createdAt: -1 });

    if (!appointment) {
      return res.json(null);
    }

    const doctor = await Doctor.findById(appointment.doctorId);

    const allAppointments = await Appointment.find({
      doctorId: appointment.doctorId
    });

    // Sort properly
    allAppointments.sort((a, b) => {
      if (a.priority === "emergency" && b.priority !== "emergency") return -1;
      if (a.priority !== "emergency" && b.priority === "emergency") return 1;
      return a.tokenNumber - b.tokenNumber;
    });

    const position =
      allAppointments.findIndex(a => a._id.toString() === appointment._id.toString()) + 1;

    const estimatedWaitTime = (position - 1) * doctor.avgConsultTime;

    res.json({
      tokenNumber: appointment.tokenNumber,
      status: appointment.status,
      position,
      estimatedWaitTime
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointment = await Appointment.findOne({
      patientId,
      status: { $in: ["waiting", "ongoing"] }
    });

    if (!appointment) {
      return res.status(400).json({ message: "No active appointment found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    if (global.io) {
      global.io.emit("queueUpdated");
    }

    res.json({ message: "Appointment cancelled successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getDoctorStats = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      doctorId,
      createdAt: { $gte: today }
    });

    const total = appointments.length;
    const emergency = appointments.filter(a => a.priority === "emergency").length;
    const completed = appointments.filter(a => a.status === "completed").length;
    const waiting = appointments.filter(a => a.status === "waiting").length;

    res.json({
      total,
      emergency,
      completed,
      waiting
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
