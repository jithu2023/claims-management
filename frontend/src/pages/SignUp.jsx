import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState('User');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    insurerId: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole !== 'Insurer') {
      setFormData({ ...formData, insurerId: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';

      const formattedRole = role === 'Insurer' ? 'Insurer' : 'User';

      const payload = {
        email: formData.email,
        password: formData.password,
        role: formattedRole,
        ...(formattedRole === 'Insurer' && isSignup ? { insurerId: formData.insurerId } : {}),
      };

      console.log("Sending request to:", `http://localhost:3000${endpoint}`);
      console.log("Payload:", payload);

      const response = await axios.post(`http://localhost:3000${endpoint}`, payload);

      alert(response.data.message || 'Authentication successful');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Navigate based on role after successful authentication
      if (formattedRole === 'User') {
        navigate('/submit-claim'); // Navigate to submit-claim if the user role
      } else {
        navigate('/manage'); // Navigate to manage if the insurer role
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      alert(error.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
        
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Role:</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="User">User</option>
            <option value="Insurer">Insurer</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            required
          />
          {role === 'Insurer' && isSignup && (
            <input
              type="text"
              name="insurerId"
              placeholder="Insurer ID"
              className="w-full p-2 border rounded mb-4"
              onChange={handleChange}
              required
            />
          )}
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Sign Up and Sign In */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
