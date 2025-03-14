import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageClaims() {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [insurerComment, setInsurerComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Replace with your actual method of retrieving the token, e.g., from localStorage, context, etc.
  const token = localStorage.getItem('authToken'); // Or any other method of getting the token

  useEffect(() => {
    if (!token) {
      setErrorMessage('Please login to manage claims');
      setLoading(false);
      return;
    }

    // Fetch claims on mount
    axios
      .get('http://localhost:3000/claims', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClaims(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching claims:', error);
        setErrorMessage('Failed to fetch claims. Please try again later.');
        setLoading(false);
      });

    return () => {
      // Clean-up any subscriptions or async calls if necessary
    };
  }, [token]);

  const handleSelectClaim = (claim) => {
    setSelectedClaim(claim);
    setInsurerComment(claim.insurerComment || '');
  };

  const handleCommentChange = (e) => {
    setInsurerComment(e.target.value);
  };

  const handleUpdateClaim = () => {
    if (!selectedClaim || !insurerComment.trim()) return;

    axios
      .patch(
        `http://localhost:3000/claims/${selectedClaim._id}`,
        { insurerComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert('Claim updated successfully!');
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim._id === selectedClaim._id ? { ...claim, insurerComment } : claim
          )
        );
        setSelectedClaim(null);
        setInsurerComment('');
      })
      .catch((error) => {
        console.error('Error updating claim:', error);
        alert('Failed to update claim. Please try again.');
      });
  };

  if (loading) {
    return <div>Loading claims...</div>;
  }

  if (errorMessage) {
    return <div className="text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full max-w-5xl mt-10 rounded-lg">
        <div className="text-2xl font-bold">MyInsure</div>
        <div className="flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-500">Home</a>
          <a href="#" className="hover:text-blue-500">About</a>
          <a href="#" className="hover:text-blue-500">Services</a>
          <a href="#" className="hover:text-blue-500">Contact</a>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 border border-black">Contact Now</button>
      </nav>

      <header className="w-full max-w-5xl py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800">Manage Claims</h2>
        <p className="text-gray-600 mt-2">
          Review, update status, and add comments to submitted claims.
        </p>
      </header>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {claims.map((claim) => (
          <div key={claim._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="text-lg font-semibold text-gray-800 mb-2">{claim.name}</p>
            <p className="text-gray-600"><strong>Amount:</strong> ${claim.claimAmount}</p>
            <p className="text-gray-600"><strong>Status:</strong> {claim.status}</p>
            <p className="text-gray-600"><strong>Submitted on:</strong> {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p className="text-gray-600"><strong>Insurer Comment:</strong> {claim.insurerComment || 'None'}</p>

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

            <button
              onClick={() => handleSelectClaim(claim)}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
            >
              Add Comment
            </button>
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold mb-4">Add Comment</h3>
            <textarea
              value={insurerComment}
              onChange={handleCommentChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 h-24"
              placeholder="Enter your comment here..."
            />
            <button
              onClick={handleUpdateClaim}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Save Comment
            </button>
            <button
              onClick={() => setSelectedClaim(null)}
              className="mt-2 w-full bg-red-500 text-white p-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageClaims;
