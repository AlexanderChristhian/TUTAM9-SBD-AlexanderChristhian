import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import { API_BASE_URL } from '../config/env';
import './HomePage.css';

// Helper function to format dates safely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  // Try parsing the date
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  // Format date as MM/DD/YYYY
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ScoreboardPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        
        // Direct axios call to the leaderboard endpoint
        const response = await axios.get(`${API_BASE_URL}/score/leaderboard`);
        console.log('Scoreboard response:', response.data);
        
        if (response.data && response.data.success) {
          setScores(response.data.payload || []);
        } else {
          setError(response.data?.message || 'Failed to load scoreboard data');
        }
      } catch (err) {
        console.error('Scoreboard fetch error:', err);
        
        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Please check if the backend is running.');
        } else if (err.response) {
          setError(`Server error: ${err.response.status} ${err.response.data?.message || ''}`);
        } else if (err.request) {
          setError('No response received from server. Please try again later.');
        } else {
          setError('An error occurred while fetching the scoreboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="bg-pink-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">🏆 Scoreboard 🏆</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-solid"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-pink-500 to-pink-400 text-white">
                <tr>
                  <th className="px-6 py-3 font-bold">Rank</th>
                  <th className="px-6 py-3 font-bold">Player</th>
                  <th className="px-6 py-3 font-bold">Score</th>
                  <th className="px-6 py-3 font-bold">Date Achieved</th>
                </tr>
              </thead>
              <tbody>
                {scores.length > 0 ? (
                  scores.map((score, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-pink-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-bold">
                        {index === 0 && <span className="text-yellow-500 text-xl">🥇</span>}
                        {index === 1 && <span className="text-gray-400 text-xl">🥈</span>}
                        {index === 2 && <span className="text-amber-700 text-xl">🥉</span>}
                        {index > 2 && <span>{index + 1}</span>}
                      </td>
                      <td className="px-6 py-4">{score.username}</td>
                      <td className="px-6 py-4 font-bold text-pink-600">{score.score}</td>
                      <td className="px-6 py-4">{formatDate(score.achieved_at || score.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      No scores available yet. Be the first to play!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreboardPage;
