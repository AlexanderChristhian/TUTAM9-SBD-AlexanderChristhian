import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  const handleGameButton = () => {
    if (user) {
      navigate('/game');
    } else {
      navigate('/login');
    }
  };
  
  const handleScoreboardButton = () => {
    navigate('/scoreboard');
  };

  return (
    <div className="bg-pink-100 min-h-screen">
      <Navbar />
      <div className="relative w-full h-screen overflow-hidden">
        <img src="/sagiri-bg.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 fade-in">
          <h1 className="text-5xl font-extrabold text-pink-100 mb-4">✨ Ayo Main Ges! ✨</h1>
          <p className="text-xl text-pink-200 max-w-lg text-center">Selamat datang di aplikasi kami! Yuk, mulai petualangan seru dan nikmati pengalaman yang menyenangkan bersama teman-temanmu.</p>
          <a href="#content" className="mt-8 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 btn-cute">
            Scroll Down ↓
          </a>
        </div>
      </div>
      <div id="content" className="p-8 text-center fade-in">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <div className="float mb-6">
            <span className="text-3xl">🏆</span>
          </div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Check Our Scoreboard!</h2>
          <p className="text-pink-500 mb-6">See who's topping the leaderboard and challenge yourself to beat their scores!</p>
          <button 
            onClick={handleScoreboardButton} 
            className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 btn-cute"
          >
            View Scoreboard
          </button>
        
          <div className="mt-10 pt-6 border-t border-pink-200">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              {user ? 'Ready to Play?' : 'Already have an account?'}
            </h2>
            <button 
              onClick={handleGameButton} 
              className="bg-pink-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-500 btn-cute"
            >
              {user ? 'Play Game Now!' : 'Login to Play'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;