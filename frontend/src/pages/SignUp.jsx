import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 

function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState("User");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    insurerId: "",
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "
https://claims-backend.vercel.app ";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole !== "Insurer") {
      setFormData({ ...formData, insurerId: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const formattedRole = role === "Insurer" ? "Insurer" : "User";

      const payload = {
        email: formData.email,
        password: formData.password,
        role: formattedRole,
        ...(formattedRole === "Insurer" && isSignup ? { insurerId: formData.insurerId } : {}),
      };

      console.log("🔍 Sending request to:", `${API_URL}${endpoint}`, payload);

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      console.log("✅ Response received:", response.data);

      if (!isSignup && response.data.token) {
        // Store both the token and userId in localStorage
        localStorage.setItem("token", response.data.token);
        if (response.data.userId) {
          localStorage.setItem("userId", response.data.userId);
          console.log(response.data.userId); // Save userId in localStorage
        }

        // Decode and log the JWT token
        const decodedToken = jwtDecode(response.data.token);
        console.log("Decoded JWT Token:", decodedToken); // Log decoded token

        // Optionally store the role or any other details from the token
        localStorage.setItem("role", decodedToken.role);
      }

      alert(response.data.message || (isSignup ? "Signup successful" : "Login successful"));

      // Navigate based on role
      navigate(formattedRole === "User" ? "/submit-claim" : "/manage");
    } catch (error) {
      console.error("❌ Authentication error:", error.response || error);
      alert(error.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full max-w-7xl mt-10 rounded-lg">
        <div className="text-2xl font-bold text-black">MyInsure</div>
        <div className="flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-500">Home</a>
          <a href="#" className="hover:text-blue-500">About</a>
          <a href="#" className="hover:text-blue-500">Services</a>
          <a href="#" className="hover:text-blue-500">Contact</a>
        </div>
      </nav>

      {/* Form */}
      <div className="flex justify-center items-center mt-10 px-6 md:px-0">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-black text-center mb-6">
            {isSignup ? "Create an Account" : "Sign In to Your Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-lg font-medium text-gray-600 mb-2">Role:</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="User">User</option>
                <option value="Insurer">Insurer</option>
              </select>
            </div>

            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              required
            />

            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              required
            />

            {/* Insurer ID (Only for Insurer Signup) */}
            {role === "Insurer" && isSignup && (
              <input
                type="text"
                name="insurerId"
                placeholder="Insurer ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleChange}
                required
              />
            )}

            {/* Submit Button */}
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-500 hover:underline"
            >
              {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;





