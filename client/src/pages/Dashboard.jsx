import { useState } from "react";
import API from "../api";

function PatientDashboard() {
  const [doctorId, setDoctorId] = useState("");
  const [message, setMessage] = useState("");

  const bookAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/api/appointments/book",
        {
          doctorId,
          priority: "normal",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Appointment booked! Token: ${res.data.tokenNumber}`);
    } catch (err) {
      setMessage("Error booking appointment");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Dashboard</h1>

      <input
        type="text"
        placeholder="Enter Doctor ID"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button
        onClick={bookAppointment}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Book Appointment
      </button>

      <p>{message}</p>
    </div>
  );
}

export default PatientDashboard;
