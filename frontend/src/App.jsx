// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Citizen/Home";
import MyReports from "./Citizen/Reports";
import CityMap from "./Citizen/CityMap";
import Profile from "./Citizen/Profile";
import ReportIssue from "./Citizen/ReportIssue";
import Overview from "./Admin/Overview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="admin/overview" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;