import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";

function QueueList({ doctorId }) {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    try {
      const res = await API.get(`/api/appointments/queue/${doctorId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.queue || [];
      setQueue(data);
    } catch (err) {
      console.error("Queue fetch error:", err);
      setQueue([]);
    }
  };

  useEffect(() => {
    if (!doctorId) return;

    fetchQueue();
    socket.on("queueUpdated", fetchQueue);

    return () => {
      socket.off("queueUpdated", fetchQueue);
    };
  }, [doctorId]);

  const currentPatient = queue.find(p => p.status === "ongoing");
  const waitingPatients = queue.filter(p => p.status === "waiting");

  return (
    <div>

      {/* 🟢 CURRENTLY SERVING */}
      <div style={styles.currentCard}>
        <h2>🟢 Currently Serving</h2>

        {currentPatient ? (
          <>
            <h1 style={styles.tokenBig}>
              Token #{currentPatient.tokenNumber}
            </h1>
            <p>Priority: {currentPatient.priority}</p>
          </>
        ) : (
          <p>No patient is being served</p>
        )}
      </div>

      {/* 📋 WAITING QUEUE */}
      <h2 style={{ marginTop: "30px" }}>📋 Waiting Queue</h2>

      {waitingPatients.length === 0 ? (
        <p>No patients waiting</p>
      ) : (
        waitingPatients.map((p) => (
          <div key={p._id} style={styles.queueCard}>
            <h3>Token #{p.tokenNumber}</h3>
            <p>ETA: {p.estimatedWaitTime} mins</p>
            <p>Priority: {p.priority}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  currentCard: {
    background: "#e8f8f5",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  },
  tokenBig: {
    fontSize: "40px",
    margin: "15px 0"
  },
  queueCard: {
    padding: "15px",
    marginBottom: "10px",
    background: "#f0f0f0",
    borderRadius: "8px"
  }
};

export default QueueList;
