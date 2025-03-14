import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ Ensure this is correctly installed

function ClaimsDashboard() {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      let token = localStorage.getItem('token');

      if (!token || token.trim() === '') {
        console.error('❌ No token found in localStorage.');
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      token = token.trim(); // Trim any extra spaces
      console.log('🔍 Debug - Token from localStorage:', token);

      try {
        // Decode token to extract user ID
        const decodedToken = jwtDecode(token);
        console.log("🔍 Debug - Decoded Token:", decodedToken); // ✅ Log the full decoded token

        const userId = decodedToken.id || decodedToken.userId || decodedToken._id; 

        if (!userId) {
          throw new Error('User ID missing in token.');
        }

        console.log('✅ Extracted User ID:', userId);

        // ✅ Ensure API route matches backend
        const response = await axios.get(`http://localhost:3000/api/claims/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Claims Data:', response.data);
        setClaims(response.data);
      } catch (error) {
        console.error('❌ Error fetching claims:', error.response || error.message);

        if (error.response?.status === 404) {
          console.error('🔍 API Route Not Found - Check Backend Route.');
          setError('No claims found. Please check your account.');
        } else if (error.response?.status === 401) {
          console.error('🔒 Unauthorized - Clearing token and redirecting to login.');
          setError('Unauthorized access. Redirecting to login...');
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }, 1500);
        } else {
          setError('Failed to fetch claims. Please check your authorization.');
        }
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchClaims, 500); // ⏳ Small delay to allow localStorage to update
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {error && <div className="text-red-600 text-lg font-semibold">{error}</div>}
      <header className="w-full max-w-5xl py-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800">My Claims</h2>
        <p className="text-gray-600 mt-2">Review and track your submitted claims below.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {claims.length > 0 ? (
            claims.map((claim) => (
              <div key={claim._id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold text-gray-800 mb-2">{claim.name || 'Unknown Name'}</p>
                <p className="text-gray-600"><strong>Amount:</strong> ${claim.claimAmount}</p>
                <p className="text-gray-600"><strong>Status:</strong> {claim.status}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg font-medium">No claims found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ClaimsDashboard;
