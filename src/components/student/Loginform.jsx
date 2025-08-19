import React, { useState } from "react";
import axios from "axios";

export default function StudentLogin() {
  const [formData, setFormData] = useState({ studentId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://api.smartbus360.com/api/student/login", formData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token); // save token
        localStorage.setItem("student", JSON.stringify(res.data.student));
        window.location.href = "/dashboard"; // redirect
      } else {
        setError("Invalid ID or Password");
      }
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Student Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
