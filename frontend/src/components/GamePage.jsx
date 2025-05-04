import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import './HomePage.css';

const GamePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'finished'
  const [timeLeft, setTimeLeft] = useState(30);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Load user data from localStorage
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
  
  // Handle timer logic
  useEffect(() => {
    let timer;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
    }
    
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="bg-pink-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-solid"></div>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Function to play multiple sound instances
  const playSound = () => {
    // Create a new audio element each time
    const audio = new Audio('/hidup-jokowi.mp3');
    audio.volume = 0.6; // Adjust volume to avoid being too loud when multiple play
    
    // Play the sound
    const playPromise = audio.play();
    
    // Handle potential play() promise rejection (browser policy)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Audio play error:', error);
      });
    }
    
    // Clean up when audio finishes playing
    audio.onended = () => {
      audio.remove(); // Remove the element when done
    };
  };
  
  const handleClick = () => {
    if (gameState === 'playing') {
      // Play sound - multiple instances possible
      playSound();
      
      // Increment score
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setSaveStatus(null);
  };
  
  const saveScore = async () => {
    try {
      setSaveStatus('saving');
      
      // Direct axios call to save score
      const response = await axios.post(`${API_BASE_URL}/score/add`, { 
        user_id: user.id, 
        score 
      });
      
      console.log('Save score response:', response.data);
      
      if (response.data && response.data.success) {
        setSaveStatus('success');
      } else {
        console.error('Failed to save score:', response.data?.message);
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Error saving score:', err);
      setSaveStatus('error');
    }
  };
  
  const viewScoreboard = () => {
    navigate('/scoreboard');
  };
  
  const renderGameContent = () => {
    switch (gameState) {
      case 'ready':
        return (
          <>
            <h2 className="text-xl text-pink-600 mb-6">Get ready to click as fast as you can!</h2>
            <p className="mb-6">You'll have 30 seconds to click the button as many times as possible.</p>
            <button 
              onClick={startGame}
              className="px-6 py-4 bg-pink-500 text-white rounded-full hover:bg-pink-600 
                       transition-all duration-300 font-bold shadow-md hover:shadow-lg
                       transform hover:scale-105"
            >
              Start Game!
            </button>
          </>
        );
        
      case 'playing':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-bold">Score: {score}</div>
              <div className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-pink-600'}`}>
                Time: {timeLeft}s
              </div>
            </div>
            
            <button 
              onClick={handleClick}
              className="w-40 h-40 relative transition-all duration-100 
                       transform hover:scale-105 active:scale-95"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              <img 
                src="/sagiri-button.png" 
                alt="Click Me!" 
                className="w-full h-full object-contain animate-bounce"
              />
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                             bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                Click Me! 💕
              </span>
            </button>
          </>
        );
        
      case 'finished':
        return (
          <>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Game Over!</h2>
            <p className="text-xl mb-6">Your final score: <span className="font-bold">{score}</span></p>
            
            <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center mt-6">
              {!saveStatus && (
                <button 
                  onClick={saveScore}
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 
                          transition-all duration-300 font-bold shadow-md hover:shadow-lg"
                >
                  Save Score
                </button>
              )}
              
              {saveStatus === 'saving' && (
                <div className="flex items-center justify-center px-6 py-3 bg-gray-200 rounded-full">
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-pink-500 border-solid rounded-full"></div>
                  Saving...
                </div>
              )}
              
              {saveStatus === 'success' && (
                <div className="px-6 py-3 bg-green-100 text-green-700 rounded-full border border-green-300">
                  Score saved successfully! ✅
                </div>
              )}
              
              {saveStatus === 'error' && (
                <div className="px-6 py-3 bg-red-100 text-red-700 rounded-full border border-red-300">
                  Error saving score ❌
                </div>
              )}
              
              <button 
                onClick={startGame}
                className="px-6 py-3 bg-pink-400 text-white rounded-full hover:bg-pink-500 
                        transition-all duration-300 font-bold shadow-md hover:shadow-lg"
              >
                Play Again
              </button>
              
              <button 
                onClick={viewScoreboard}
                className="px-6 py-3 bg-pink-300 text-pink-700 rounded-full hover:bg-pink-400 
                        transition-all duration-300 font-bold shadow-md hover:shadow-lg"
              >
                View Scoreboard
              </button>
            </div>
          </>
        );
        
      default:
        return <p>Something went wrong. Please refresh the page.</p>;
    }
  };
  
  return (
    <div className="bg-pink-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-pink-600 mb-6">Cute Clicker Game</h1>
          
          <div className="bg-pink-50 p-6 rounded-lg border-2 border-pink-200 mb-6">
            {renderGameContent()}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Try to get the highest score and compete with other players!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
