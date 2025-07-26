import React, { useState } from "react";
import Breadcrumb from "./Breadcrumb.jsx";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaUpload,
  FaNapster,
} from "react-icons/fa";
import userImage from "../../../../assets/img/avatars/user.png";
import axios from "axios";
import { getUser, removeTokenAndUser } from "../../../../config/authService.js";
import { useNavigate } from "react-router-dom";

const Settings = ({ user }) => {
  const navigate = useNavigate();
  const defaultUser = {
    email: user?.email || "No email provided",
    full_name: user?.full_name || "",
    username: user?.username || "",
    profile_picture: user?.profile_picture || userImage,
    phone_number: user?.phone_number || null
  };

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: defaultUser.email,
    full_name: defaultUser.full_name,
    username: defaultUser.username,
    profile_picture: defaultUser.profile_picture,
    phone_number: defaultUser.phone_number,
  });

  // const [profilePic, setProfilePic] = useState({
  //   profile_picture: defaultUser.profile_picture,
  // });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const userRole = getUser();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);
    if (name === "phone_number" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        profile_picture: URL.createObjectURL(file),
      });
      setProfilePhotoFile(file);
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const role = userRole?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }

    const data = new FormData();
    
    // Only add fields that are not related to the profile picture URL
    Object.keys(formData).forEach((key) => {
      if (key !== "profile_picture") {
        data.append(key, formData[key]);
      }
    });
  
    // Add the actual file if exists
    if (profilePhotoFile) {
      data.append("profile_picture", profilePhotoFile);
    }
  
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/profile/update/${user.userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        setMessage("Profile updated successfully! Please log in again");
        removeTokenAndUser();
        navigate('/auth/sign-in');
        alert("Profile updated successfully! Please log in again");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Sorry, you are not logged in. Please log in.");
      } else {
        console.error("Error updating profile:", error);
      }
    }
  };
  

  return (
    <div className="mx-auto flex w-full flex-col gap-2 p-6 md:flex-row">
      {/* Personal Information Section */}
      <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:w-1/2">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Personal Information
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Full Name and Phone Number Fields */}
            <div className="mb-6 flex flex-col gap-6 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Full Name
                </label>
                <div className="relative mt-1">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    id="fullName"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400 mr-4" />
                  <input
                    type="tel"
                    name="phone_number"
                    id="phoneNumber"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={12}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
                  />

                </div>
              </div>
            </div>

            {/* Email Address Field */}
            <div className="mb-6">
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="emailAddress"
                  value={formData.email}
                  disabled
                  onChange={handleInputChange}
                  className={`w-full cursor-not-allowed rounded-lg 
                    border 
                    border-gray-300 
                    bg-gray-200 
                    py-3 pl-10 
                    text-gray-500 
                    opacity-50 
                    focus:border-blue-500 
                    focus:outline-none 
                    dark:border-gray-600 
                    dark:bg-gray-700 
                    dark:text-gray-400
                    dark:focus:border-blue-400`}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="mb-6">
              <label
                htmlFor="rusername"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Username
              </label>
              <div className="relative mt-1">
                <FaNapster className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  name="rusername"
                  id="rusername"
                  disabled
                  value={defaultUser.username}
                  onChange={handleInputChange}
                  className={`w-full cursor-not-allowed rounded-lg 
                    border 
                    border-gray-300 
                    bg-gray-200 
                    py-3 pl-10 
                    text-gray-500 
                    opacity-50 
                    focus:border-blue-500 
                    focus:outline-none 
                    dark:border-gray-600 
                    dark:bg-gray-700 
                    dark:text-gray-400
                    dark:focus:border-blue-400`}
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:w-1/2">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Photo
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex justify-center gap-4 text-center">
              <div className="h-40 w-40 overflow-hidden border border-blue-600 rounded-full text-center">
                <img
                  src={formData.profile_picture ?? `${import.meta.env.VITE_API_BASE_URL}/${formData.profile_picture}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex mt-10">
              <div className="mb-6">
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  <div className="flex">
                    <FaUpload className="mr-2"/>
                    Upload Profile Photo
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 block w-full cursor-pointer text-gray-700 dark:text-gray-300"
                />
                {message && <p className="mt-2 text-green-500">{message}</p>}
              </div>
              <div className="justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Update Photo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
