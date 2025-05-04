import React from 'react';
import Navbar from './Navbar.jsx';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
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

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      userScores: [],
      scoresLoading: false
    };
  }

  componentDidMount() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.setState({ user: userData });
        
        // Fetch user's scores
        this.fetchUserScores(userData.id);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    this.setState({ loading: false });
  }

  fetchUserScores = async (userId) => {
    try {
      console.log("Fetching scores for user:", userId);
      this.setState({ scoresLoading: true });
      
      const response = await axios.get(`${API_BASE_URL}/score/user/${userId}`);
      console.log("API response:", response.data);
      
      if (response.data && response.data.success) {
        this.setState({ userScores: response.data.payload });
      } else {
        console.error('Failed to fetch user scores:', response.data?.message);
      }
    } catch (err) {
      console.error('Error fetching user scores:', err);
      
      if (err.code === 'ERR_NETWORK') {
        console.error('Network error: Server might be down');
      } else if (err.response) {
        console.error(`Server responded with error: ${err.response.status}`);
      }
    } finally {
      this.setState({ scoresLoading: false });
    }
  };
  
  render() {
    const { loading, user, scoresLoading, userScores } = this.state;
    
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
    
    return (
      <div className="bg-pink-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">My Profile</h1>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-pink-200 rounded-full p-8 flex items-center justify-center">
                <div className="text-6xl">👤</div>
              </div>
              
              <div className="flex-grow">
                <div className="mb-4">
                  <label className="block text-pink-700 font-bold mb-2">Username</label>
                  <div className="px-4 py-2 bg-pink-50 rounded-lg">{user.username}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-pink-700 font-bold mb-2">Email</label>
                  <div className="px-4 py-2 bg-pink-50 rounded-lg">{user.email}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-pink-700 font-bold mb-2">Member Since</label>
                  <div className="px-4 py-2 bg-pink-50 rounded-lg">
                    {formatDate(user.created_at)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-pink-600 mb-4">My Scores</h2>
              
              {scoresLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-t-2 border-pink-500 border-solid rounded-full"></div>
                </div>
              ) : userScores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-pink-100">
                      <tr>
                        <th className="px-4 py-2">Score</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userScores.map((score, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-pink-50' : 'bg-white'}>
                          <td className="px-4 py-2 font-bold">{score.score}</td>
                          <td className="px-4 py-2">{formatDate(score.achieved_at || score.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4 bg-pink-50 rounded-lg">You haven't recorded any scores yet. Try playing the game!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
