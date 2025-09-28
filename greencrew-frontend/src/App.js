import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ScanPage from "./pages/ScanPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
         
          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/scan" element={<PrivateRoute><ScanPage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;