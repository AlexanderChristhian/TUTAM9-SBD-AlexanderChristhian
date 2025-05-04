import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import { API_BASE_URL } from '../config/env';
import './HomePage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Direct axios call to register with the correct endpoint
      const response = await axios.post(`${API_BASE_URL}/user/register`, {
        username, 
        email, 
        password
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.success) {
        // Show success message
        alert('Registration successful! Please login.');
        
        // Navigate to login page
        navigate('/login');
      } else {
        // Handle successful request but registration failed
        throw new Error(response.data?.message || 'Registration failed. Unknown error.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Extract error message from axios error
      if (err.response?.data) {
        setError(err.response.data.message || 'Registration failed');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check if the backend is running.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something else went wrong
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-100 min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-4 text-center">Register</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-pink-700 font-bold mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800" 
              placeholder="Enter your username" 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-pink-700 font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800" 
              placeholder="Enter your email" 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-pink-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800" 
              placeholder="Enter your password" 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-pink-700 font-bold mb-2">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800" 
              placeholder="Confirm your password" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 btn-cute"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>Already have an account? <a href="/login" className="text-pink-600 hover:underline">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;