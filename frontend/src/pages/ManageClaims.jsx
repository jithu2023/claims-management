import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function ManageClaims() {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [insurerComment, setInsurerComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/claims")
      .then((response) => {
        setClaims(response.data);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch claims. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleSelectClaim = (claim) => {
    setSelectedClaim({ ...claim });
    setInsurerComment(claim.insurerComments || "");
  };

  const handleCommentChange = (e) => {
    setInsurerComment(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedClaim((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleUpdateClaim = () => {
    if (!selectedClaim || !insurerComment.trim()) return;

    axios
      .patch(`http://localhost:3000/claims/${selectedClaim._id}`, {
        insurerComments: insurerComment,
        status: selectedClaim.status,
      })
      .then((response) => {
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim._id === selectedClaim._id ? { ...claim, ...response.data } : claim
          )
        );
        setSelectedClaim(null);
        setInsurerComment("");
      })
      .catch(() => {
        alert("Failed to update claim. Please try again.");
      });
  };

  const chartData = [
    { status: "Pending", count: claims.filter((c) => c.status === "Pending").length },
    { status: "Approved", count: claims.filter((c) => c.status === "Approved").length },
    { status: "Rejected", count: claims.filter((c) => c.status === "Rejected").length },
  ];

  if (loading) return <div className="text-gray-800 text-center">Loading claims...</div>;
  if (errorMessage) return <div className="text-red-500 text-center">{errorMessage}</div>;

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 flex flex-col items-center">
      <header className="w-full max-w-7xl py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900">Manage Claims</h2>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {claims.map((claim) => (
          <div key={claim._id} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-900">{claim.name}</p>
            <p className="text-gray-700"><strong>Amount:</strong> ${claim.claimAmount}</p>
            <p className="text-gray-700"><strong>Status:</strong> {claim.status}</p>
            <p className="text-gray-700"><strong>Insurer Comment:</strong> {claim.insurerComments || "None"}</p>
            <button
              onClick={() => handleSelectClaim(claim)}
              className="mt-4 w-full bg-gray-900 hover:bg-gray-700 text-white p-2 rounded-lg"
            >
              Edit Claim
            </button>
          </div>
        ))}
      </div>

      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Edit Claim</h3>
            <textarea
              value={insurerComment}
              onChange={handleCommentChange}
              className="w-full p-3 border border-gray-400 rounded-lg h-24 bg-gray-200 text-gray-900"
              placeholder="Enter your comment here..."
            />
            <div className="mt-4">
              <label className="block text-sm text-gray-700">Update Status</label>
              <select
                value={selectedClaim.status}
                onChange={handleStatusChange}
                className="w-full p-2 mt-2 border border-gray-400 rounded-lg bg-gray-200 text-gray-900"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <button
              onClick={handleUpdateClaim}
              className="mt-4 w-full bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedClaim(null)}
              className="mt-2 w-full bg-red-500 hover:bg-red-400 text-white p-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Claim Status Overview</h3>
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

export default ManageClaims;
