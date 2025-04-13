import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';
import AnimatedBackground from './AnimatedBackground';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set animation complete after a delay to ensure smooth entrance
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignupClick = () => {
    navigate('/register');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');

        // Store user data in localStorage
        localStorage.setItem('username', username);

        // If the response includes user data, store it
        if (data.user && data.user.userId) {
          localStorage.setItem('userId', data.user.userId);

          // Dispatch custom event to notify the navbar about the login
          window.dispatchEvent(new Event('loginStateChange'));

          // Add a small delay for the success message to be visible
          setTimeout(() => {
            navigate('/matches');
          }, 1000);
          return;
        }

        // Fallback if no user ID was returned (shouldn't happen)
        setTimeout(() => {
          navigate('/matches');
        }, 1000);
      } else {
        // Provide more specific error messages based on the response
        if (data.message === 'Invalid username or password') {
          setMessage('Incorrect username or password. Please try again.');
        } else {
          setMessage(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('Unable to connect to the server. Please check your internet connection.');
      } else {
        setMessage('An error occurred during login. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-background">
      <AnimatedBackground />
      {/* Animated bubbles */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username" className="input-label">Username</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="input-label">Password</label>
          </div>

          {message && (
            <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message.includes('successful') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <div className="switch-form">
          <p>Don't have an account? <span className="switch-form-link" onClick={handleSignupClick}>Sign up</span></p>
        </div>

        {/* Animated decorative elements that appear after initial animation */}
        {animationComplete && (
          <>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-pink-200 rounded-full opacity-20"></div>
          </>
        )}
      </div>
    </div>
  );
}
export default Login;
