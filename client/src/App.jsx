import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import DoctorPanel from "./pages/DoctorPanel";
import PatientDashboard from "./pages/PatientDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DisplayScreen from "./pages/DisplayScreen";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function Layout() {
  const location = useLocation();

  // ❌ Hide Navbar on Display Screen
  const hideNavbar = location.pathname.startsWith("/display");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor" element={<DoctorPanel />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/display/:doctorId" element={<DisplayScreen />} />
        <Route path="/" element={<Home />}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
