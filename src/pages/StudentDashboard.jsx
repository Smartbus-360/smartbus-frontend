import React from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    navigate("/student/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">

        <h2 className="text-2xl font-semibold mb-6">
          Welcome to SmartBus360
        </h2>

        <div className="space-y-4">

          {/* 🔑 Update Password */}
          <button
            onClick={() => navigate("/student/update-password")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium"
          >
            Update Password
          </button>

          {/* ❤️ Donate Us */}
          <button
            onClick={() => navigate("/student/map-subscription")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-medium"
          >
            Donate Us
          </button>

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
