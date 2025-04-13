import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in and has MBTI type
  useEffect(() => {
    // This function will check the login state
    const checkLoginState = () => {
      const storedUsername = localStorage.getItem('username');
      const storedMbtiType = localStorage.getItem('userMbti');

      if (storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);

        // If user is logged in but doesn't have MBTI type stored on server,
        // check if they have it stored locally
        if (storedMbtiType && !localStorage.getItem('needsMbtiTest')) {
          console.log('User has MBTI type:', storedMbtiType);
        }
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    };

    // Check login state initially
    checkLoginState();

    // Set up event listener for storage changes (for when another tab logs in/out)
    window.addEventListener('storage', checkLoginState);

    // Create a custom event listener for login/logout within the same tab
    window.addEventListener('loginStateChange', checkLoginState);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', checkLoginState);
      window.removeEventListener('loginStateChange', checkLoginState);
    };
  }, [location.pathname]); // Re-run when the route changes

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userMbti');
    setIsLoggedIn(false);
    setUsername('');

    // Dispatch custom event to notify other components about the logout
    window.dispatchEvent(new Event('loginStateChange'));

    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient flex items-center justify-center transform transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span
                className={`ml-2 text-2xl font-bold ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                } transition-colors duration-300`}
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                Soulmate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/mbti"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 nav-item hover-underline-animation ${
                location.pathname === '/mbti'
                  ? 'bg-purple-100 text-purple-700'
                  : isScrolled
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  : 'text-white hover:bg-white/10'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              MBTI
            </Link>

            {isLoggedIn ? (
              <>
                <div className="relative group nav-item" style={{ animationDelay: '0.2s' }}>
                  <Link
                    to="/matches"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center hover-underline-animation ${
                      location.pathname === '/matches'
                        ? 'bg-purple-100 text-purple-700'
                        : isScrolled
                        ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Your Matches
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 dropdown-animation z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Your Matches</p>
                    </div>

                    <Link
                      to="/matches"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      View Your Matches
                    </Link>
                  </div>
                </div>

                <div className="relative ml-3 group">
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 nav-item ${
                      isScrolled
                        ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        : 'text-white hover:bg-white/10'
                    }`}
                    style={{ animationDelay: '0.3s' }}
                  >
                    <span className="mr-1">{username}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 dropdown-animation">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 nav-item hover-underline-animation ${
                    location.pathname === '/login'
                      ? 'bg-purple-100 text-purple-700'
                      : isScrolled
                      ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      : 'text-white hover:bg-white/10'
                  }`}
                  style={{ animationDelay: '0.2s' }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 nav-item transform hover:scale-105 ${
                    location.pathname === '/register'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient text-white hover:shadow-lg'
                  }`}
                  style={{ animationDelay: '0.3s' }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-300'
              } focus:outline-none`}
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/mbti"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/mbti'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            MBTI
          </Link>

          {isLoggedIn ? (
            <>
              <div className="px-3 py-2">
                <div className="flex items-center justify-between text-base font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Your Matches
                  </span>
                </div>

                <div className="ml-7 space-y-1 border-l-2 border-purple-100 pl-2">
                  <Link
                    to="/matches"
                    className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/matches' ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Your Matches
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Signed in as <span className="font-bold text-gray-700">{username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/login'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
