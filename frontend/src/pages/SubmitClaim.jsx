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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid claim amount.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("claimAmount", amount);
    data.append("description", formData.description);
    data.append("file", formData.file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    try {
      setLoading(true);

      let emailExists = false;
      try {
        const existingClaim = await axios.get(
          `http://localhost:3000/claims/check-email/${formData.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        emailExists = existingClaim.data.exists;
      } catch (error) {
        console.warn("Could not verify existing claim:", error.response || error);
      }

      if (emailExists) {
        alert("A claim with this email already exists.");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:3000/claims", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
          <input type="text" name="name" placeholder="Name" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <input type="number" name="amount" placeholder="Claim Amount" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" className="w-full p-3 border rounded-lg h-24" onChange={handleChange} required />
          <input type="file" name="file" className="w-full text-sm text-gray-500" accept="image/*" onChange={handleFileChange} required />
          {filePreview && <img src={filePreview} alt="File preview" className="w-full h-64 object-contain border rounded-lg shadow-md" />}
          <button type="submit" className="w-full bg-black text-white p-3 rounded-lg text-lg font-semibold" disabled={loading}>{loading ? "Submitting..." : "Submit Claim"}</button>
        </form>
      </div>
    </div>
  );
}

export default SubmitClaim;
