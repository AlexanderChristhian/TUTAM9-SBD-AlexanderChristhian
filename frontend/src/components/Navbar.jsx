import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Load user data from localStorage
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
  
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMobileMenuOpen(false); // Close mobile menu when a link is clicked
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/home';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-pink-400 p-4 text-white shadow-lg w-full sticky top-0 z-10">
      <div className="container mx-auto">
        {/* Desktop and Mobile Layout */}
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-2xl font-bold">✨ Cute App</span>
          </div>
          
          {/* Hamburger Menu Button (Mobile Only) */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-4">
            <ul className="flex items-center space-x-4 mr-4">
              {[
                { name: 'Home', path: '/home' },
                { name: 'Scoreboard', path: '/scoreboard' },
                ...((!loading && user) ? [
                  { name: 'Game', path: '/game' },
                  { name: 'Profile', path: '/profile' }
                ] : [])
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    onClick={() => handleLinkClick(item.name)}
                    className={`px-3 py-2 rounded-full transition-all duration-300 hover:bg-pink-600 ${
                      activeLink === item.name ? 'bg-pink-600 font-bold' : 'hover:scale-105'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline">{user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="px-4 py-2 bg-white text-pink-500 rounded-full hover:bg-pink-100 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col space-y-2 pb-2">
            {[
              { name: 'Home', path: '/home' },
              { name: 'Scoreboard', path: '/scoreboard' },
              ...((!loading && user) ? [
                { name: 'Game', path: '/game' },
                { name: 'Profile', path: '/profile' }
              ] : [])
            ].map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path}
                  onClick={() => handleLinkClick(item.name)}
                  className={`block px-3 py-2 rounded-lg transition-all duration-300 hover:bg-pink-600 ${
                    activeLink === item.name ? 'bg-pink-600 font-bold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            
            {!loading && (
              <div className="pt-2 border-t border-pink-400 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium">
                      Signed in as <span className="font-bold">{user.username}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg transition-all duration-300 hover:bg-pink-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 bg-white text-pink-500 rounded-lg transition-all duration-300 text-center"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 bg-pink-600 text-white rounded-lg transition-all duration-300 text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;