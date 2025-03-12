import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClaimsDashboard() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/claims')
      .then((response) => {
        setClaims(response.data);
      })
      .catch((error) => {
        console.error('Error fetching claims:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
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

      {/* Dashboard Header */}
      <header className="w-full max-w-5xl py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800">My Claims</h2>
        <p className="text-gray-600 mt-2">Review and track your submitted claims below.</p>
      </header>

      {/* Claims List */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {claims.map((claim) => (
          <div
            key={claim._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <p className="text-lg font-semibold text-gray-800 mb-2">{claim.name}</p>
            <p className="text-gray-600"><strong>Amount:</strong> ${claim.claimAmount}</p>
            <p className="text-gray-600"><strong>Status:</strong> {claim.status}</p>
            <p className="text-gray-600"><strong>Submitted on:</strong> {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}</p>

            {claim.fileUrl && (
              <div className="mt-4">
                <p className="text-gray-600"><strong>Attachment:</strong></p>
                <img
                  src={`http://localhost:3000${claim.fileUrl}`}
                  alt="Claim file"
                  className="w-full h-48 object-cover rounded-lg mt-2"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClaimsDashboard;
