import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { useNavigate } from 'react-router-dom';
import './personalityTest.css';
import './ResultStyles.css';

// MBTI type descriptions
const mbtiDescriptions = {
  INTJ: "The Architect - Imaginative and strategic thinkers, with a plan for everything.",
  INTP: "The Logician - Innovative inventors with an unquenchable thirst for knowledge.",
  ENTJ: "The Commander - Bold, imaginative and strong-willed leaders, always finding a way.",
  ENTP: "The Debater - Smart and curious thinkers who cannot resist an intellectual challenge.",
  INFJ: "The Advocate - Quiet and mystical, yet very inspiring and tireless idealists.",
  INFP: "The Mediator - Poetic, kind and altruistic people, always eager to help a good cause.",
  ENFJ: "The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners.",
  ENFP: "The Campaigner - Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
  ISTJ: "The Logistician - Practical and fact-minded individuals, whose reliability cannot be doubted.",
  ISFJ: "The Defender - Very dedicated and warm protectors, always ready to defend their loved ones.",
  ESTJ: "The Executive - Excellent administrators, unsurpassed at managing things or people.",
  ESFJ: "The Consul - Extraordinarily caring, social and popular people, always eager to help.",
  ISTP: "The Virtuoso - Bold and practical experimenters, masters of all kinds of tools.",
  ISFP: "The Adventurer - Flexible and charming artists, always ready to explore and experience something new.",
  ESTP: "The Entrepreneur - Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
  ESFP: "The Entertainer - Spontaneous, energetic and enthusiastic people – life is never boring around them."
};

// MBTI compatibility matches
const mbtiCompatibility = {
  INTJ: ["ENFP", "ENTP"],
  INTP: ["ENFJ", "ENTJ"],
  ENTJ: ["INFP", "INTP"],
  ENTP: ["INFJ", "INTJ"],
  INFJ: ["ENTP", "ENFP"],
  INFP: ["ENTJ", "ENFJ"],
  ENFJ: ["INTP", "ISFP"],
  ENFP: ["INTJ", "INFJ"],
  ISTJ: ["ESFP", "ESTP"],
  ISFJ: ["ESFP", "ESTP"],
  ESTJ: ["ISFP", "ISTP"],
  ESFJ: ["ISFP", "ISTP"],
  ISTP: ["ESFJ", "ESTJ"],
  ISFP: ["ESFJ", "ESTJ"],
  ESTP: ["ISFJ", "ISTJ"],
  ESFP: ["ISFJ", "ISTJ"]
};

// MBTI colors
const mbtiColors = {
  INTJ: { primary: "from-indigo-600 to-blue-700", secondary: "indigo-100", accent: "indigo-600" },
  INTP: { primary: "from-blue-600 to-cyan-700", secondary: "blue-100", accent: "blue-600" },
  ENTJ: { primary: "from-purple-600 to-indigo-700", secondary: "purple-100", accent: "purple-600" },
  ENTP: { primary: "from-violet-600 to-purple-700", secondary: "violet-100", accent: "violet-600" },
  INFJ: { primary: "from-fuchsia-600 to-pink-700", secondary: "fuchsia-100", accent: "fuchsia-600" },
  INFP: { primary: "from-pink-600 to-rose-700", secondary: "pink-100", accent: "pink-600" },
  ENFJ: { primary: "from-rose-600 to-red-700", secondary: "rose-100", accent: "rose-600" },
  ENFP: { primary: "from-red-600 to-orange-700", secondary: "red-100", accent: "red-600" },
  ISTJ: { primary: "from-amber-600 to-yellow-700", secondary: "amber-100", accent: "amber-600" },
  ISFJ: { primary: "from-yellow-600 to-lime-700", secondary: "yellow-100", accent: "yellow-600" },
  ESTJ: { primary: "from-lime-600 to-green-700", secondary: "lime-100", accent: "lime-600" },
  ESFJ: { primary: "from-green-600 to-emerald-700", secondary: "green-100", accent: "green-600" },
  ISTP: { primary: "from-emerald-600 to-teal-700", secondary: "emerald-100", accent: "emerald-600" },
  ISFP: { primary: "from-teal-600 to-cyan-700", secondary: "teal-100", accent: "teal-600" },
  ESTP: { primary: "from-cyan-600 to-sky-700", secondary: "cyan-100", accent: "cyan-600" },
  ESFP: { primary: "from-sky-600 to-blue-700", secondary: "sky-100", accent: "sky-600" }
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, name, gender } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Get the color scheme based on MBTI type
  const colorScheme = result && mbtiColors[result] ? mbtiColors[result] : {
    primary: "from-purple-600 to-blue-600",
    secondary: "purple-100",
    accent: "purple-600"
  };

  // Store the MBTI result in localStorage when component mounts
  useEffect(() => {
    if (result) {
      localStorage.setItem('userMbti', result);
      console.log('MBTI type stored:', result);

      // Set animation complete after delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);

      // Hide confetti after a while
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [result]);

  const handleLoginClick = () => {
    navigate('/register');
  };

  const getCompatibleTypes = () => {
    if (result && mbtiCompatibility[result]) {
      return mbtiCompatibility[result];
    }
    return [];
  };

  // If no result, show error
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-800">No Result Found</h2>
            <p className="mt-2 text-gray-600">Please take the personality test to see your results.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Animated circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-3000"></div>
        </div>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, index) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 5 + 3;
            const delay = Math.random() * 2;
            const color = [
              'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
              'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500'
            ][Math.floor(Math.random() * 8)];

            return (
              <div
                key={index}
                className={`absolute ${color} rounded-full opacity-80`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: '-5%',
                  animation: `fall ${animationDuration}s linear ${delay}s infinite`
                }}
              />
            );
          })}
        </div>
      )}

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main result card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-700 transform translate-y-0 hover:translate-y-[-5px]">
          <div className={`bg-gradient-to-r ${colorScheme.primary} h-3 w-full`}></div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 animate-gradient bg-size-200">
                  {name}'s Personality
                </h1>
                <p className="text-gray-600 text-lg">Completed on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-${colorScheme.secondary} border-4 border-${colorScheme.accent} shadow-lg mb-3 transform transition-transform duration-500 ${animationComplete ? 'scale-100' : 'scale-0'}`}>
                  <span className="text-4xl font-bold text-gray-800">{result}</span>
                </div>
                <span className="text-sm font-medium text-gray-500">Your MBTI Type</span>
              </div>
            </div>

            <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-inner">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You Are: {result}
              </h2>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{mbtiDescriptions[result] || "A unique personality type with special characteristics."}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Compatible With
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getCompatibleTypes().map(type => (
                      <span key={type} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">{type}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Name:</span> {name}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Gender:</span> {gender}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Type:</span> {result}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 inline-block">
                  <ReactTyped
                    strings={[
                      "Ready to find your perfect match?",
                      "Discover your compatible connections!",
                      "Your soulmate is waiting for you!"
                    ]}
                    typeSpeed={40}
                    backSpeed={30}
                    loop={true}
                  />
                </h2>
              </div>

              <button
                onClick={handleLoginClick}
                className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="relative z-10 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to See Your Matches
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

              </div>

      {/* Footer */}
      <div className="bg-gray-50 py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Personality Match. All rights reserved.</p>
        </div>
      </div>

      {/* All animations are now in ResultStyles.css */}
    </div>
  );
};

export default Result;