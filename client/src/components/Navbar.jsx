import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.nav}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        🏥 SmartQueue
      </h2>

      <div>
        {role && (
          <span style={{ marginRight: "20px" }}>
            Logged in as: <b>{role.toUpperCase()}</b>
          </span>
        )}
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    width: "100%",
    padding: "15px 40px",
    backgroundColor: "#1e293b",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    zIndex: 1000
  },
  logoutBtn: {
    padding: "8px 15px",
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Navbar;
