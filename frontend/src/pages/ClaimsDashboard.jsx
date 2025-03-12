import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

function ClaimsDashboard() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/claims")
      .then((response) => {
        setClaims(response.data);
      })
      .catch((error) => {
        console.error("Error fetching claims:", error);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold">My Claims</h2>
      <ul className="mt-4 space-y-2">
        {claims.map((claim) => (
          <li key={claim._id} className="p-4 border rounded shadow-md">
            <p><strong>Name:</strong> {claim.name}</p>
            <p><strong>Amount:</strong> ${claim.claimAmount}</p>
            <p><strong>Status:</strong> {claim.status}</p>
            <p><strong>Submitted on:</strong> {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : "N/A"}</p>
            
            {claim.fileUrl && (
              <div className="mt-2">
                <p><strong>Attachment:</strong></p>
                <img src={`http://localhost:3000${claim.fileUrl}`} alt="Claim file" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClaimsDashboard;
