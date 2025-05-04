import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import { API_BASE_URL } from '../config/env';
import './HomePage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Attempting login with:', { email });
      console.log('Using API URL:', API_BASE_URL);
      
      // Updated to use the environment variable via our config
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Proper handling of backend response format
      if (response.data && response.data.success) {
        // Store user data in the same format backend provides it
        const userData = response.data.payload;
        
        // Store in localStorage as expected by the app
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'Bearer token'); // Backend doesn't use tokens in response
        
        console.log('User logged in successfully');
        
        // Navigate to home page
        navigate('/home');
      } else {
        // Handle successful request but login failed
        throw new Error(response.data?.message || 'Login failed. Unknown error.');
      }
    } catch (err) {
      console.error('Login error details:', err);
      
      // Extract error message from backend response if available
      if (err.response?.data) {
        setError(err.response.data.message || 'Authentication failed');
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
        <h1 className="text-3xl font-bold text-pink-600 mb-4 text-center">Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
          <button 
            type="submit" 
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 btn-cute"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>Don't have an account? <a href="/register" className="text-pink-600 hover:underline">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;