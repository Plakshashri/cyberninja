import React, { useState, useEffect, useRef } from "react";
import { areCompatible, getCompatibilityLevel, getCompatibilityDescription } from "../utils/mbtiCompatibility";
import potentialMatches from "../data/potentialMatches";
import aiChatService from "../services/aiChatService";
import "./matches.css";

const Matches = () => {
  const [username, setUsername] = useState('');
  const [userMbti, setUserMbti] = useState('');
  const [compatibleMatches, setCompatibleMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContexts, setConversationContexts] = useState({});
  const selectedMatchIdRef = useRef(null);

  useEffect(() => {
    // Get username and MBTI type from localStorage when component mounts
    const storedUsername = localStorage.getItem('username');

    // IMPORTANT FIX: Always use a default MBTI type if none is found
    // This prevents redirects to the personality test
    const storedMbti = localStorage.getItem('userMbti') || 'INFJ';

    // Always store an MBTI type to prevent future redirects
    if (!localStorage.getItem('userMbti')) {
      localStorage.setItem('userMbti', 'INFJ');
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Always set the MBTI type and show matches
    setUserMbti(storedMbti);

    // Filter potential matches based on compatibility
    const matches = potentialMatches.filter(match =>
      areCompatible(storedMbti, match.mbtiType)
    );

    // Sort matches by compatibility level (ideal first, then good)
    matches.sort((a, b) => {
      const levelA = getCompatibilityLevel(storedMbti, a.mbtiType);
      const levelB = getCompatibilityLevel(storedMbti, b.mbtiType);

      if (levelA === 'ideal' && levelB !== 'ideal') return -1;
      if (levelA !== 'ideal' && levelB === 'ideal') return 1;
      return 0;
    });

    setCompatibleMatches(matches);
    setLoading(false);
  }, []);

  // Add keyboard event listener to close chat when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isChatOpen) {
        resetChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isChatOpen]);

  // Function to reset chat state
  const resetChat = () => {
    setIsChatOpen(false);
    setChatMessages([]);
    setIsTyping(false);
    selectedMatchIdRef.current = null;
  };

  // Function to initialize chat with a match
  const initializeChat = (match) => {
    // Create a new conversation context if one doesn't exist
    if (!conversationContexts[match.id]) {
      setConversationContexts(prev => ({
        ...prev,
        [match.id]: aiChatService.createConversation()
      }));
    }

    selectedMatchIdRef.current = match.id;
    setIsChatOpen(true);
    setChatMessages([]);

    // Add a welcome message from the match
    setTimeout(() => {
      const profile = aiChatService.getMbtiProfile(match.mbtiType);
      const welcomeMessage = {
        id: Date.now(),
        text: `Hi there! I'm ${match.name}, an ${match.mbtiType} personality type${profile ? ` (${profile.name})` : ''}. I'm excited to chat with you!`,
        sender: 'match',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages([welcomeMessage]);
    }, 500);
  };

  // Function to handle sending a message
  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prevMessages => [...prevMessages, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Get the current match
    const currentMatch = selectedMatch;
    if (!currentMatch) {
      resetChat();
      return;
    }

    // Get the conversation context for this match
    const matchId = currentMatch.id;
    let context = conversationContexts[matchId];

    // If no context exists, create one
    if (!context) {
      context = aiChatService.createConversation();
      setConversationContexts(prev => ({
        ...prev,
        [matchId]: context
      }));
    }

    // Calculate a realistic typing delay based on message length
    const messageLength = message.length;
    const baseDelay = 1000; // Minimum delay in milliseconds
    const typingSpeed = 50; // Milliseconds per character (average typing speed)
    const typingDelay = Math.min(baseDelay + messageLength * typingSpeed, 5000); // Cap at 5 seconds

    // Generate AI response after a realistic typing delay
    setTimeout(() => {
      // Generate response based on the match's MBTI type and message content
      const aiResponse = aiChatService.generateResponse(message, currentMatch.mbtiType, context);

      const responseMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'match',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Hide typing indicator and add the message
      setIsTyping(false);
      setChatMessages(prevMessages => [...prevMessages, responseMessage]);
    }, typingDelay);
  };

  return (
    <div>
      {username ? (
        <div className="text-center mb-4">
          <h1
            style={{ fontFamily: "Dancing Script, cursive" }}
            className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#F89C74] to-[#f66539]"
          >
            Hi {username}! These are your matches
          </h1>
        </div>
      ) : (
        <h1
          style={{ fontFamily: "Dancing Script, cursive" }}
          className="text-center text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#F89C74] to-[#f66539]"
        >
          Your Matches
        </h1>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading your matches...</p>
        </div>
      ) : compatibleMatches.length > 0 ? (
        <div className="flex items-center justify-center gap-10 mt-10 flex-wrap">
          {compatibleMatches.map(match => {
            const compatibilityLevel = getCompatibilityLevel(userMbti, match.mbtiType);
            const isIdeal = compatibilityLevel === 'ideal';

            return (
              <div
                key={match.id}
                className={`match-card h-[350px] w-[220px] card-gradient flex flex-col items-center justify-center gap-3 shadow-lg rounded-[16px] relative ${isIdeal ? 'border-2 border-pink-500' : 'border border-purple-100'} cursor-pointer overflow-hidden`}
                onClick={() => {
                  setSelectedMatch(match);
                }}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white opacity-70 z-0"></div>



                {/* MBTI Type Image */}
                <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-purple-200 shadow-lg mb-3 mt-4 z-10">
                  <img
                    src={`/images/mbti/${match.mbtiType.toUpperCase()}.svg`}
                    alt={`${match.mbtiType} personality type`}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/mbti/default.svg';
                    }}
                  />
                  <div className="absolute -bottom-2 right-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-md z-20 border border-white mbti-label">
                    {match.mbtiType}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -inset-1 border-2 border-dashed border-purple-200 rounded-full opacity-50 animate-spin-slow"></div>
                </div>

                <h1 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 z-10">{match.name}</h1>
                <p className="text-sm text-gray-600 z-10">{match.age || '25'} years</p>

                {/* Compatibility Badge */}
                <div className={`text-xs px-4 py-1.5 rounded-full font-bold shadow-sm z-10 ${isIdeal ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300' : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'}`}>
                  {isIdeal ? '💖 Ideal Match 💖' : '✨ Good Match ✨'}
                </div>

                <button
                  className="bg-gradient-to-r from-[#f66539] to-[#e55529] text-white text-sm px-5 py-2 rounded-full hover:from-[#e55529] hover:to-[#d44519] shadow-md transform hover:scale-105 transition duration-200 font-medium z-10 mt-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    setSelectedMatch(match);
                    
                  }}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    View & Chat
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl mb-4">No compatible matches found.</p>
          <p className="text-gray-600">Try updating your MBTI type or check back later!</p>
        </div>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-purple-100 relative overflow-hidden">
            {/* Decorative header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>

            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">{selectedMatch.name}</h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-gray-400 hover:text-gray-800 transition-colors duration-200 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex mb-6">
              {/* MBTI Type Image */}
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                  <img
                    src={`/images/mbti/${selectedMatch.mbtiType.toUpperCase()}.svg`}
                    alt={`${selectedMatch.mbtiType} personality type`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/mbti/default.svg';
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 right-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-md z-20 border border-white mbti-label">
                  {selectedMatch.mbtiType}
                </div>
              </div>

              <div className="ml-6">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-gray-700">{selectedMatch.age || '25'} years</p>
                </div>

                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-700">New York, USA</p>
                </div>

                <p className="mt-3 text-gray-600 italic">"{selectedMatch.bio || 'Looking for someone who understands my personality type and shares my interests.'}"
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl mb-6 border border-purple-100 shadow-sm">
              <h3 className="font-semibold mb-2 text-purple-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Compatibility with your {userMbti} type:
              </h3>
              <p className="text-gray-700">{getCompatibilityDescription(userMbti, selectedMatch.mbtiType)}</p>
            </div>

            {/* Chat or Close buttons */}
            <div className="flex justify-between items-center">
              <button
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:from-purple-600 hover:to-indigo-700 shadow-md transition duration-200 font-medium flex items-center"
                onClick={() => initializeChat(selectedMatch)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat Now
              </button>

              <button
                className="bg-gradient-to-r from-[#f66539] to-[#e55529] text-white px-6 py-2.5 rounded-full hover:from-[#e55529] hover:to-[#d44519] shadow-md transition duration-200 font-medium"
                onClick={() => {
                  setSelectedMatch(null);
                  resetChat();
                }}
              >
                Close
              </button>
            </div>

            {/* Chat Interface */}
            {isChatOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 backdrop-blur-sm"
                onClick={(e) => {
                  // Close chat when clicking outside the chat container
                  if (e.target === e.currentTarget) {
                    resetChat();
                  }
                }}
              >
                <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border border-purple-100 relative overflow-hidden h-[500px] flex flex-col chat-container">
                  {/* Small hint text at the top */}
                  <div className="absolute -top-6 left-0 right-0 text-center">
                    <span className="text-white text-xs opacity-70">Click outside or press ESC to close</span>
                  </div>
                  {/* Chat header */}
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-purple-200">
                        <img
                          src={`/images/mbti/${selectedMatch.mbtiType.toUpperCase()}.svg`}
                          alt={selectedMatch.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/mbti/default.svg';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedMatch.name}</h3>
                        <p className="text-xs text-gray-500">{selectedMatch.mbtiType}</p>
                      </div>
                    </div>

                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto mb-4 p-2 chat-messages">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chatMessages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`message px-4 py-2 ${message.sender === 'user' ? 'message-user' : 'message-match'}`}
                            >
                              <p>{message.text}</p>
                              <p className="message-time">
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                              <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{selectedMatch?.name} is typing...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Message input */}
                  <div className="border-t border-gray-200 pt-3 chat-input">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const message = e.target.message.value;
                        handleSendMessage(message);
                        e.target.reset();
                      }}
                      className="flex items-center w-full"
                    >
                      <input
                        type="text"
                        name="message"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-r-full hover:from-purple-600 hover:to-indigo-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>

                  {/* Additional close button at the bottom */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={resetChat}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      Close Chat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
