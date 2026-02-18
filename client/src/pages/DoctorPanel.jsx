import { useEffect, useState } from "react";
import API from "../api";
import QueueList from "../components/QueueList";
import socket from "../socket";

function DoctorPanel() {
  const [doctorId, setDoctorId] = useState(null);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch Doctor Profile
  const fetchDoctorProfile = async () => {
    try {
      const res = await API.get("/api/doctors/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDoctorId(res.data._id);
    } catch (err) {
      console.error("Doctor profile error:", err);
    }
  };

  // 🔹 Fetch Analytics
  const fetchStats = async (id) => {
    try {
      const res = await API.get(`/api/appointments/stats/${id}`);
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // 🔹 Call Next Patient
  const callNextPatient = async () => {
    try {
      const res = await API.put(
        `/api/appointments/next/${doctorId}`
      );

      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    if (!doctorId) return;

    fetchStats(doctorId);

    socket.on("queueUpdated", () => {
      fetchStats(doctorId);
    });

    return () => socket.off("queueUpdated");
  }, [doctorId]);

  if (!doctorId) {
    return <h2 style={{ padding: "40px" }}>Loading doctor...</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.header}>🏥 Doctor Dashboard</h1>

        {/* 🔥 Analytics Cards */}
        {stats && (
          <div style={styles.statsContainer}>
            <StatCard title="👥 Total Today" value={stats.total} />
            <StatCard title="🚨 Emergency" value={stats.emergency} />
            <StatCard title="⏳ Waiting" value={stats.waiting} />
            <StatCard title="✅ Completed" value={stats.completed} />
          </div>
        )}

        <button style={styles.nextBtn} onClick={callNextPatient}>
          ▶ Call Next Patient
        </button>

        {message && <p style={{ marginBottom: "20px" }}>{message}</p>}

        <QueueList doctorId={doctorId} />
      </div>
    </div>
  );
}

// 🔹 Stat Card Component
function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <h2>{value}</h2>
      <p>{title}</p>
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
  container: {
    width: "100%",
    maxWidth: "1200px",
    padding: "40px"
  },
  header: {
    marginBottom: "25px"
  },
  statsContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px"
  },
  statCard: {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
  },
  nextBtn: {
    padding: "15px 30px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px"
  }
};

export default DoctorPanel;
