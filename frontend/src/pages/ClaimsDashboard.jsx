import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function ClaimsDashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("
https://claims-backend.vercel.app/claims") // ✅ Fixed URL
      .then((response) => {
        setClaims(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching claims:", error); // ✅ Debugging
        setErrorMessage("Failed to fetch claims. Please try again later.");
        setLoading(false);
      });
  }, []); // ✅ Added dependency array

  const chartData = [
    { status: "Pending", count: claims.filter((c) => c.status === "Pending").length },
    { status: "Approved", count: claims.filter((c) => c.status === "Approved").length },
    { status: "Rejected", count: claims.filter((c) => c.status === "Rejected").length },
  ];

  if (loading) return <div className="text-gray-800 text-center text-xl font-semibold">Loading claims...</div>;
  if (errorMessage) return <div className="text-red-500 text-center text-xl font-semibold">{errorMessage}</div>;

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-0 m-0">
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full max-w-7xl mt-10 rounded-lg">
        <div className="text-2xl font-bold">MyInsure</div>
        <div className="flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-500">Home</a>
          <a href="#" className="hover:text-blue-500">About</a>
          <a href="#" className="hover:text-blue-500">Services</a>
          <a href="#" className="hover:text-blue-500">Contact</a>
        </div>
      </nav>

      <header className="w-full max-w-7xl py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800">All Claims</h2>
        <p className="text-gray-600 mt-2">Review and track all submitted claims below.</p>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {claims.length > 0 ? (
          claims.map((claim) => (
            <div key={claim._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <p className="text-lg font-semibold text-gray-800">{claim.name}</p>
              <p className="text-gray-600"><strong>Email:</strong> {claim.email}</p>
              <p className="text-gray-600"><strong>Claim Amount:</strong> ${claim.claimAmount}</p>
              <p className={`px-3 py-1 mt-2 inline-block text-sm font-semibold rounded ${
                claim.status === "Approved" ? "bg-green-500 text-white" :
                claim.status === "Rejected" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
              }`}>{claim.status}</p>
              {claim.insurerComments && (
                <p className="text-gray-600 mt-3"><strong>Insurer's Comments:</strong> {claim.insurerComments}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg font-medium">No claims found.</p>
        )}
      </div>

      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Claims Trend Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="status" stroke="#4A4A4A" />
            <YAxis stroke="#4A4A4A" />
            <Tooltip wrapperStyle={{ backgroundColor: "white", color: "black" }} />
            <Legend wrapperStyle={{ color: "gray" }} />
            <Bar dataKey="count" fill="#6366F1" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ClaimsDashboard;
