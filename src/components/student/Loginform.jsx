// // Loginform.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // 👈 add this


// export default function StudentLogin() {
//   const [formData, setFormData] = useState({ username: "", password: "" }); // 👈 use 'username'
//   const [error, setError] = useState("");
//     const navigate = useNavigate(); 


//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/login/user",
//         { username: formData.username, password: formData.password } // 👈 send expected keys
//       );

//       if (res.data?.success) {
//         localStorage.setItem("accessToken", res.data.token);
//         localStorage.setItem("userId", res.data.userId);
//         localStorage.setItem("username", res.data.userName);
//         localStorage.setItem("email", res.data.email);
//   navigate("/register"); 
//       } else {
//         setError("Invalid username or password");
//       }
//     } catch (err) {
//       setError(
//         err?.response?.data?.message || "Login failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-xl font-bold mb-4">Login</h2>
//         {error && <p className="text-red-500 mb-2">{error}</p>}
//         <input
//           type="text"
//           name="username"
//           placeholder="Username or Email"
//           value={formData.username}
//           onChange={handleChange}
//           className="w-full p-2 border mb-3"
//           autoComplete="username"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 border mb-3"
//           autoComplete="current-password"
//         />
//         <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


// StudentLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://api.smartbus360.com/api/login/user",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      if (res.data?.success) {
        // 🔐 Store EXACTLY like CURL flow
        localStorage.setItem("studentToken", res.data.token);
        localStorage.setItem("studentId", res.data.userId);
        localStorage.setItem("studentName", res.data.userName);
        localStorage.setItem("studentEmail", res.data.email);

        // 👉 Go to student map page
        navigate("/student/map");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  // return (
  //   <div className="flex justify-center items-center min-h-screen bg-gray-100">
  //     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
  //       <h2 className="text-xl font-bold mb-4">Student Login</h2>

  //       {error && <p className="text-red-500 mb-2">{error}</p>}

  //       <input
  //         type="text"
  //         name="username"
  //         placeholder="Username"
  //         value={formData.username}
  //         onChange={handleChange}
  //         className="w-full p-2 border mb-3"
  //       />

  //       <input
  //         type="password"
  //         name="password"
  //         placeholder="Password"
  //         value={formData.password}
  //         onChange={handleChange}
  //         className="w-full p-2 border mb-3"
  //       />

  //       <button className="w-full bg-blue-600 text-white p-2 rounded">
  //         Login
  //       </button>
  //     </form>
  //   </div>
  // );
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Student Login
      </h2>

      {/* Error */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            autoComplete="username"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
        >
          Login
        </button>
      </form>

      {/* Footer */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Secure access for registered students only
      </p>

    </div>
  </div>
);

}
