import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import socket from "../socket";

function DisplayScreen() {
  const { doctorId } = useParams();
  const [queue, setQueue] = useState([]);
  const [time, setTime] = useState(new Date());

  const fetchQueue = async () => {
    try {
      const res = await API.get(`/api/appointments/queue/${doctorId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.queue || [];
      setQueue(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    socket.on("queueUpdated", fetchQueue);

    const clock = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      socket.off("queueUpdated", fetchQueue);
      clearInterval(clock);
    };
  }, []);

  const current = queue.find(p => p.status === "ongoing");
  const waiting = queue.filter(p => p.status === "waiting");

  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <h1>🏥 Smart Hospital Queue System</h1>
        <h2>{time.toLocaleTimeString()}</h2>
      </div>

      {/* Now Serving */}
      <div style={styles.nowServing}>
        <h2>🟢 NOW SERVING</h2>
        <h1 style={styles.bigToken}>
          {current ? `Token #${current.tokenNumber}` : "--"}
        </h1>
        <p style={{ fontSize: "20px", marginTop: "10px" }}>
          {current ? "Please proceed to Cabin" : "Waiting for next patient"}
        </p>
      </div>

      {/* Next Token */}
      <div style={styles.nextSection}>
        <h2>⏭ NEXT</h2>
        <h1 style={styles.nextToken}>
          {waiting.length > 0 ? `Token #${waiting[0].tokenNumber}` : "--"}
        </h1>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    position: "absolute",
    top: "20px",
    textAlign: "center"
  },
  nowServing: {
    textAlign: "center",
    marginBottom: "40px"
  },
  bigToken: {
    fontSize: "120px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#22c55e"
  },
  nextSection: {
    textAlign: "center"
  },
  nextToken: {
    fontSize: "70px",
    color: "#38bdf8"
  }
};

export default DisplayScreen;
