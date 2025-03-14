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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Upload file to Cloudinary and return the URL
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "claims_imgs"); // Cloudinary preset
    data.append("cloud_name", "dr5c54ggu");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dr5c54ggu/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.error("File upload failed:", error);
      alert("File upload failed. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid claim amount.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    try {
      // Check if an email already exists in claims
      const existingClaim = await axios.get(
        `
https://claims-backend.vercel.app/claims/check-email/${formData.email}`, // Removed extra space
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (existingClaim.data.exists) {
        alert("A claim with this email already exists.");
        setLoading(false);
        return;
      }

      // Upload file to Cloudinary if provided
      let fileUrl = "";
      if (formData.file) {
        fileUrl = await uploadToCloudinary(formData.file);
        if (!fileUrl) {
          setLoading(false);
          return;
        }
      }

      // Send claim data to backend (without Multer handling)
      await axios.post(
        "https://claims-backend.vercel.app/claims",
        {
          name: formData.name,
          email: formData.email,
          claimAmount: amount,
          description: formData.description,
          fileUrl, // Send Cloudinary URL instead of local file
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Claim submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting claim:", error.response || error);
      alert("Failed to submit claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Submit a Claim</h2>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Claim Amount"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-3 border rounded-lg h-24"
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="file"
            className="w-full text-sm text-gray-500"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {filePreview && (
            <img
              src={filePreview}
              alt="File preview"
              className="w-full h-64 object-contain border rounded-lg shadow-md"
            />
          )}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg text-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitClaim;
