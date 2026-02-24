import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.container,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0px)" : "translateY(40px)",
        }}
      >
        <h1 style={styles.title}>SmartQueue</h1>

        <p style={styles.subtitle}>
          A Real-Time Smart Hospital Queue Management System
        </p>

        <p style={styles.description}>
          SmartQueue helps hospitals and clinics manage patient queues
          efficiently. Patients can book appointments online, track their
          token number, view real-time status updates, and get notified
          when it's their turn. Doctors can manage and control their queue
          seamlessly.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/login")}
        >
          🚀 Get Started
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    maxWidth: "700px",
    background: "white",
    padding: "50px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    transition: "all 0.8s ease",
  },
  title: {
    fontSize: "42px",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#666",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#444",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 30px",
    fontSize: "16px",
    borderRadius: "30px",
    border: "none",
    background: "#667eea",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Home;