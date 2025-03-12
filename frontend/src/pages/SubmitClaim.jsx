import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SubmitClaim() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    description: "",
    file: null,
  });
  const [filePreview, setFilePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
    setFilePreview(URL.createObjectURL(file)); // Show file preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("amount", formData.amount);
    data.append("description", formData.description);
    data.append("file", formData.file);

    try {
      await axios.post("http://localhost:3000/claims", data);
      alert("Claim submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to submit claim. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full max-w-5xl mt-10 rounded-lg">
        {/* Logo Section */}
        <div className="text-2xl font-bold">MyLogo</div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-500">Home</a>
          <a href="#" className="hover:text-blue-500">About</a>
          <a href="#" className="hover:text-blue-500">Services</a>
          <a href="#" className="hover:text-blue-500">Contact</a>
        </div>

        {/* Contact Now Button */}
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 border border-black">
          Contact Now
        </button>
      </nav>

      {/* Claim Form Section */}
      <div className="flex justify-center items-center w-full max-w-5xl py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Submit a Claim</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" 
              onChange={handleChange} 
              required 
            />

            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" 
              onChange={handleChange} 
              required 
            />

            <input 
              type="number" 
              name="amount" 
              placeholder="Claim Amount" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" 
              onChange={handleChange} 
              required 
            />

            <textarea 
              name="description" 
              placeholder="Description" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 h-24" 
              onChange={handleChange} 
              required 
            />

            <div className="w-full border p-3 rounded-lg bg-gray-100">
              <input 
                type="file" 
                name="file" 
                className="w-full text-sm text-gray-500" 
                onChange={handleFileChange} 
                required 
              />
            </div>

            {filePreview && (
              <img 
                src={filePreview} 
                alt="File preview" 
                className="w-full mt-4 rounded-lg shadow-md"
              />
            )}

            <button 
              type="submit" 
              className="w-full bg-black text-white p-3 rounded-lg text-lg font-semibold hover:bg-gray-800 border border-black transition"
            >
              Submit Claim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubmitClaim;
