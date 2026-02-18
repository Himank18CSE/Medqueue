import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";

function PatientDashboard() {
  const [myAppointment, setMyAppointment] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [priority, setPriority] = useState("normal");

  const token = localStorage.getItem("token");

  const fetchMyStatus = async () => {
    try {
      const res = await API.get("/api/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyAppointment(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/api/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const bookAppointment = async () => {
    if (!selectedDoctor) return alert("Select doctor");

    try {
      await API.post(
        "/api/appointments/book",
        { doctorId: selectedDoctor, priority },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowBooking(false);
      fetchMyStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelAppointment = async () => {
    try {
      const res = await API.put(
        "/api/appointments/cancel",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log(res.data);
      fetchMyStatus();
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  useEffect(() => {
    fetchMyStatus();
    fetchDoctors();

    socket.on("queueUpdated", fetchMyStatus);
    return () => socket.off("queueUpdated", fetchMyStatus);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>🎫 My Appointment Status</h1>

        {!myAppointment ? (
          <>
            {!showBooking ? (
              <button
                style={styles.button}
                onClick={() => setShowBooking(true)}
              >
                📅 Book New Appointment
              </button>
            ) : (
              <>
                <select
                  style={styles.input}
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.userId?.name}
                    </option>
                  ))}
                </select>

                <select
                  style={styles.input}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="emergency">Emergency</option>
                </select>

                <button style={styles.button} onClick={bookAppointment}>
                  Confirm Booking
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2>Token #{myAppointment.tokenNumber}</h2>

            {myAppointment.status === "ongoing" ? (
              <h2 style={{ color: "green" }}>🟢 It's Your Turn!</h2>
            ) : (
              <>
                <p>Status: Waiting</p>
                <p>Position: {myAppointment.position}</p>
                <p>ETA: {myAppointment.estimatedWaitTime} mins</p>

                <button style={styles.cancelBtn} onClick={cancelAppointment}>
                  ❌ Cancel Appointment
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
  paddingTop: "80px",
  minHeight: "100vh",
  background: "#f4f7fb",
  display: "flex",
  justifyContent: "center"
},

  card: {
    background: "white",
    padding: "40px",
    width: "400px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
  cancelBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
};

export default PatientDashboard;
