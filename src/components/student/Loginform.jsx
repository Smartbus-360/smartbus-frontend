// Loginform.jsx
import React, { useState } from "react";
import axios from "axios";

export default function StudentLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" }); // 👈 use 'username'
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "https://api.smartbus360.com/api/login/user",
        { username: formData.username, password: formData.password } // 👈 send expected keys
      );

      if (res.data?.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", res.data.userName);
        localStorage.setItem("email", res.data.email);
        window.location.href = "/dashboard";
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          autoComplete="current-password"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
