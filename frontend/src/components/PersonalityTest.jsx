import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./personalityTest.css";
const questions = [
  // Extraversion (E) vs Introversion (I)
  { id: 1, trait: "E", text: "I enjoy being the center of attention." },
  { id: 2, trait: "E", text: "I feel energized after spending time with a group of people." },
  { id: 3, trait: "E", text: "I prefer to work in teams rather than alone." },

  // Sensing (S) vs Intuition (N)
  { id: 4, trait: "S", text: "I prefer concrete facts over abstract theories." },
  { id: 5, trait: "S", text: "I focus more on present realities than future possibilities." },
  { id: 6, trait: "S", text: "I prefer practical solutions over theoretical ones." },
  { id: 7, trait: "N", text: "I enjoy thinking about the future and its possibilities." },
  { id: 8, trait: "N", text: "I often notice patterns and connections that others miss." },
  { id: 9, trait: "N", text: "I enjoy exploring abstract concepts and ideas." },

  // Thinking (T) vs Feeling (F)
  { id: 10, trait: "T", text: "I make decisions based on logic rather than emotions." },
  { id: 11, trait: "T", text: "I value objective truth over personal feelings." },
  { id: 12, trait: "T", text: "I prefer to analyze problems rather than focus on how they affect people." },
  { id: 13, trait: "F", text: "I consider how my decisions will affect others." },
  { id: 14, trait: "F", text: "I value harmony and getting along with others." },
  { id: 15, trait: "F", text: "I am sensitive to others' needs and feelings." },

  // Judging (J) vs Perceiving (P)
  { id: 16, trait: "C", text: "I like to have a detailed plan before starting a project." },  // C for Conscientiousness = J
  { id: 17, trait: "C", text: "I prefer structure and predictability." },                      // C for Conscientiousness = J
  { id: 18, trait: "C", text: "I like to make decisions and stick to them." },                 // C for Conscientiousness = J
  { id: 19, trait: "O", text: "I enjoy spontaneity and flexibility." },                        // O for Openness = P
  { id: 20, trait: "O", text: "I prefer to keep my options open rather than make final decisions." }, // O for Openness = P
  { id: 21, trait: "O", text: "I am adaptable and go with the flow." },                        // O for Openness = P

  // Additional questions for more accuracy
  { id: 22, trait: "E", text: "I find it easy to introduce myself to new people." },
  { id: 23, trait: "S", text: "I trust information that comes directly from my experiences." },
  { id: 24, trait: "N", text: "I enjoy imagining different possibilities and scenarios." },
  { id: 25, trait: "T", text: "I prefer to give honest feedback even if it might hurt someone's feelings." },
  { id: 26, trait: "F", text: "I often make decisions based on what feels right rather than what is logical." },
  { id: 27, trait: "C", text: "I like to complete one project before starting another." },
  { id: 28, trait: "O", text: "I enjoy exploring new ideas and possibilities." },
  { id: 29, trait: "A", text: "I am generally trusting and cooperative with others." },
  { id: 30, trait: "A", text: "I try to be kind and considerate to everyone I meet." },
];

function PersonalityTest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMbtiNotification, setShowMbtiNotification] = useState(false);
  const [username, setUsername] = useState('');
  // State for managing question sets
  const [currentSet, setCurrentSet] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  // Calculate the number of question sets (5 questions per set)
  const questionsPerSet = 5;
  const totalSets = Math.ceil(questions.length / questionsPerSet);

  // Get current set of questions
  const getCurrentQuestions = () => {
    const startIndex = currentSet * questionsPerSet;
    const endIndex = Math.min(startIndex + questionsPerSet, questions.length);
    return questions.slice(startIndex, endIndex);
  };

  // Function to go to the next set of questions
  const nextSet = () => {
    if (currentSet < totalSets - 1) {
      setCurrentSet(currentSet + 1);
      // Scroll to the question container
      const questionContainer = document.getElementById('question-container');
      if (questionContainer) {
        // Add a small delay to ensure state update has completed
        setTimeout(() => {
          questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }
  };

  // Function to go to the previous set of questions
  const prevSet = () => {
    if (currentSet > 0) {
      setCurrentSet(currentSet - 1);
      // Scroll to the question container
      const questionContainer = document.getElementById('question-container');
      if (questionContainer) {
        // Add a small delay to ensure state update has completed
        setTimeout(() => {
          questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }
  };

  // Function to handle when a question is answered
  const handleQuestionAnswered = (questionId, value) => {
    const newAnswers = { ...answeredQuestions, [questionId]: value };
    setAnsweredQuestions(newAnswers);
    // We track answered questions to enable/disable the submit button

    // We don't automatically move to the next question in the set-based approach
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user was redirected from login due to missing MBTI type
    const needsMbtiTest = localStorage.getItem('needsMbtiTest');
    const storedUsername = localStorage.getItem('username');
    const storedMbtiType = localStorage.getItem('userMbti');
    const userId = localStorage.getItem('userId');

    if (needsMbtiTest === 'true' && storedUsername) {
      // If the user already has a stored MBTI type locally but not on the server
      if (storedMbtiType && userId) {
        console.log('User has local MBTI type but not on server. Updating server...');

        // Update the server with the local MBTI type
        const updateServerWithMbtiType = async () => {
          try {
            const response = await fetch('http://localhost:3000/api/mbti/result', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: userId,
                name: storedUsername,
                gender: 'Not specified',
                result: storedMbtiType,
                scores: {}
              }),
            });

            if (response.ok) {
              console.log('Successfully updated server with local MBTI type');
              // Navigate to matches page
              navigate('/matches');
            } else {
              // If update fails, still show the notification
              setShowMbtiNotification(true);
              setUsername(storedUsername);
            }
          } catch (error) {
            console.error('Error updating server with MBTI type:', error);
            // If there's an error, still show the notification
            setShowMbtiNotification(true);
            setUsername(storedUsername);
          }
        };

        updateServerWithMbtiType();
      } else {
        // If no local MBTI type, show the notification
        setShowMbtiNotification(true);
        setUsername(storedUsername);
      }

      // Clear the flag so it doesn't show again on refresh
      localStorage.removeItem('needsMbtiTest');
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Initialize traits and count objects with all traits used in the questions
    const traits = { E: 0, S: 0, N: 0, T: 0, F: 0, C: 0, O: 0, A: 0 };
    const count = { E: 0, S: 0, N: 0, T: 0, F: 0, C: 0, O: 0, A: 0 };

    console.log('Starting MBTI calculation with answers:', data);

    questions.forEach((q) => {
      const questionKey = "q" + q.id;
      const val = parseInt(data[questionKey]);

      if (isNaN(val)) {
        console.warn(`Missing or invalid answer for question ${q.id} (${q.trait}): ${q.text}`);
        return; // Skip this question
      }

      console.log(`Question ${q.id} (${q.trait}): ${q.text} - Answer: ${val}`);
      traits[q.trait] += val;
      count[q.trait]++;
    });

    // Calculate average scores for each trait
    // Handle division by zero by defaulting to 3 (neutral)
    const avg = {
      E: count.E > 0 ? traits.E / count.E : 3,
      S: count.S > 0 ? traits.S / count.S : 3,
      N: count.N > 0 ? traits.N / count.N : 3,
      T: count.T > 0 ? traits.T / count.T : 3,
      F: count.F > 0 ? traits.F / count.F : 3,
      C: count.C > 0 ? traits.C / count.C : 3,
      O: count.O > 0 ? traits.O / count.O : 3,
      A: count.A > 0 ? traits.A / count.A : 3,
    };

    console.log('Raw trait scores:', traits);
    console.log('Question counts per trait:', count);
    console.log('Average scores per trait:', avg);

    // Correctly calculate MBTI type based on the standard dichotomies
    // E vs I: Extraversion (E) vs Introversion (I)
    // S vs N: Sensing (S) vs Intuition (N)
    // T vs F: Thinking (T) vs Feeling (F)
    // J vs P: Judging (J) vs Perceiving (P)

    // For E/I: Use the E trait directly (higher score = more Extraverted)
    const firstLetter = avg.E >= 3 ? "E" : "I";

    // For S/N: Compare S and N scores (higher S = Sensing, higher N = Intuition)
    const secondLetter = avg.S >= avg.N ? "S" : "N";

    // For T/F: Compare T and F scores (higher T = Thinking, higher F = Feeling)
    const thirdLetter = avg.T >= avg.F ? "T" : "F";

    // For J/P: Use a combination of traits (C for Judging, O for Perceiving)
    const fourthLetter = avg.C >= 3 ? "J" : "P";

    const result = firstLetter + secondLetter + thirdLetter + fourthLetter;

    console.log('MBTI calculation details:', {
      E_score: avg.E,
      S_score: avg.S,
      N_score: avg.N,
      T_score: avg.T,
      F_score: avg.F,
      C_score: avg.C,
      firstLetter,
      secondLetter,
      thirdLetter,
      fourthLetter
    });

    // Store MBTI result in localStorage
    localStorage.setItem('userMbti', result);
    console.log('MBTI type determined and stored:', result);

    // Check if user is logged in
    const userId = localStorage.getItem('userId');

    // Save result to database
    try {
      // Prepare request body
      const requestBody = {
        name: data.name,
        gender: data.gender,
        result: result,
        scores: avg
      };

      // If user is logged in, include their ID
      if (userId) {
        requestBody.userId = userId;
        console.log('Including user ID in MBTI result:', userId);
      }

      const response = await fetch('http://localhost:3000/api/mbti/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to save MBTI result');
      }

      // Continue to result page
      navigate("/result", {
        state: {
          result,
          avg,
          name: data.name,
          gender: data.gender,
        },
      });
    } catch (error) {
      console.error('Error saving MBTI result:', error);
      // Still navigate to result page even if saving fails
      navigate("/result", {
        state: {
          result,
          avg,
          name: data.name,
          gender: data.gender,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // These functions are used in the UI for navigation buttons
  // Keeping them commented for future reference
  // const handleLoginClick = () => {
  //   navigate('/login');
  // };

  // const handleMbtiClick = () => {
  //   navigate('/mbti');
  // };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Landing Section */}
      <div className="relative bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-30">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-screen filter blur-xl animate-blob"
                style={{
                  backgroundColor: `rgba(${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, 0.2)`,
                  width: `${Math.random() * 400 + 100}px`,
                  height: `${Math.random() * 400 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 20 + 10}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-200 animate-gradient">
                  Find Your Soulmate
                </span>
                <span className="block text-3xl md:text-4xl mt-2 text-purple-200">
                  with AI-Powered Personality Matching
                </span>
              </h1>

              <p className="text-xl text-purple-100 mb-8 max-w-xl">
                Our advanced algorithm analyzes your personality traits to connect you with truly compatible partners who share your values and complement your character.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">98% Match Accuracy</span>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-sm">10,000+ Successful Matches</span>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">100% Secure & Private</span>
                </div>
              </div>

              <div className="animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 mx-auto md:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 shadow-xl">
                  <img
                    src="/images/couple-match.jpg"
                    alt="Happy couple matched through personality test"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80';
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-white">4.9/5 from 2,300+ reviews</span>
                    </div>
                    <blockquote className="italic text-purple-100 mb-4">
                      "I found my perfect match within a week! The personality test was spot on and connected me with someone who truly understands me."
                    </blockquote>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">JS</div>
                      <div className="ml-3">
                        <p className="text-white font-medium">Jessica S.</p>
                        <p className="text-purple-200 text-sm">Matched with David, ENFJ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-purple-50">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {showMbtiNotification && (
        <div className="fixed top-20 left-0 right-0 mx-auto max-w-md bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 z-20 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Hi {username}! Please complete this personality test to see your matches.
              </p>
              <p className="mt-1 text-xs">
                We need your MBTI type to find compatible matches for you.
              </p>
              <button
                onClick={() => setShowMbtiNotification(false)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {/* How It Works Section */}
      <div className="bg-purple-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">How Our AI Matching Works</h2>
            <p className="text-lg text-purple-700 max-w-2xl mx-auto">Our scientifically-backed personality test uses advanced AI to find your most compatible matches</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Take the Personality Test</h3>
                <p className="text-gray-600">Answer our carefully designed questions to reveal your true personality traits and preferences.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Analyzes Your Profile</h3>
                <p className="text-gray-600">Our advanced algorithm processes your responses to identify your MBTI personality type and compatibility factors.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Meet Your Matches</h3>
                <p className="text-gray-600">Get connected with highly compatible partners who complement your personality and share your values.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
                <a href="#personality-test" className="relative block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                  Start Your Journey Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Test Section */}
      <div id="personality-test" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-purple-50 via-purple-50 to-pink-50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 opacity-30 transform -skew-y-6 z-0"></div>

        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-30 transform skew-y-6 z-0"></div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-multiply filter blur-xl animate-blob"
                style={{
                  backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`,
                  width: `${Math.random() * 400 + 100}px`,
                  height: `${Math.random() * 400 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 20 + 10}s`
                }}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 bg-white/80 backdrop-blur-sm p-8 max-w-2xl mx-auto rounded-2xl shadow-xl border border-purple-100">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <h2
              style={{ fontFamily: "Dancing Script, cursive" }}
              className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient font-bold mb-2 tracking-wider floating-animation"
            >
              Personality Test
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full animate-gradient"></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 mt-4 mb-4">
              Answer these questions honestly to discover your MBTI personality type and find your perfect soulmate match.
            </p>

            <div className="flex items-center justify-center mb-2 text-purple-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Your results are private and secure</span>
            </div>

            <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p>Fields marked with <span className="text-red-500 font-medium">*</span> are required</p>
            </div>
          </div>
        </div>

        {/* Question Slider/Carousel */}
        <div className="relative mb-12 question-container" id="question-container">
          {/* Current Set of Questions */}
          <div className="space-y-8">
            {getCurrentQuestions().map((question) => (
              <div key={question.id} className="space-y-4 p-6 bg-white rounded-xl shadow-md border border-purple-100 question-card animate-fadeIn">
                <div className="flex items-center justify-center mb-6">
                  <span className="inline-flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-purple-100 text-purple-700 font-bold">{question.id}</span>
                  <h3 className="text-xl font-medium text-gray-800">{question.text}</h3>
                </div>

                <div className="flex justify-between max-w-md mx-auto text-lg">
                  <span className="text-red-700 font-medium">Strongly Disagree</span>
                  <span className="text-green-700 font-medium">Strongly Agree</span>
                </div>

                <div className="flex justify-between items-center max-w-md mx-auto px-4">
                  {[1, 2, 3, 4, 5].map((val) => {
                    // Define border colors with first and last options darker
                    let border;
                    if (val === 1) {
                      border = "border-red-700"; // Darkest red for first option
                    } else if (val === 2) {
                      border = "border-red-400"; // Lighter red for second option
                    } else if (val === 3) {
                      border = "border-gray-400"; // Neutral for middle option
                    } else if (val === 4) {
                      border = "border-green-400"; // Lighter green for fourth option
                    } else {
                      border = "border-green-700"; // Darkest green for last option
                    }

                    // Define background colors for selected state
                    let bgColor;
                    if (val === 1) {
                      bgColor = "bg-red-700"; // Darkest red for first option
                    } else if (val === 2) {
                      bgColor = "bg-red-400"; // Lighter red for second option
                    } else if (val === 3) {
                      bgColor = "bg-gray-400"; // Neutral for middle option
                    } else if (val === 4) {
                      bgColor = "bg-green-400"; // Lighter green for fourth option
                    } else {
                      bgColor = "bg-green-700"; // Darkest green for last option
                    }

                    const qName = "q" + question.id;
                    const isSelected = answeredQuestions[qName] === val.toString();

                    return (
                      <label
                        key={val}
                        className="flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-110 px-1"
                        onClick={() => handleQuestionAnswered(qName, val.toString())}
                      >
                        <input
                          type="radio"
                          name={qName}
                          value={val}
                          checked={isSelected}
                          onChange={() => {}} // Controlled component needs onChange
                          {...register(qName, { required: true })}
                          className="peer hidden"
                        />
                        <div
                          className={`rounded-full border-2 ${border} ${isSelected ? bgColor : 'bg-white'} ${isSelected ? 'border-4' : ''} transition-all duration-300 ${val === 1 ? 'w-9 h-9' : val === 2 ? 'w-6 h-6' : val === 3 ? 'w-4 h-4' : val === 4 ? 'w-6 h-6' : 'w-9 h-9'}`}
                        ></div>
                        <span className={`text-xs mt-1 font-medium ${isSelected ? 'font-bold' : ''} ${val === 1 ? 'text-red-700' : val === 2 ? 'text-red-400' : val === 3 ? 'text-gray-500' : val === 4 ? 'text-green-400' : 'text-green-700'}`}>
                          {val === 1 ? '1' : val === 2 ? '2' : val === 3 ? '3' : val === 4 ? '4' : '5'}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors["q" + question.id] && (
                  <div className="max-w-md mx-auto mt-2">
                    <p className="text-center text-red-500 text-sm bg-red-50 py-2 px-3 rounded-md border border-red-200 shadow-sm animate-pulse">
                      <span className="inline-block mr-1">⚠️</span>
                      <span className="font-medium">Please answer this question</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevSet}
              disabled={currentSet === 0}
              className={`flex items-center px-6 py-3 rounded-full ${currentSet === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-colors duration-300 shadow-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous Set
            </button>
            <button
              type="button"
              onClick={nextSet}
              disabled={currentSet === totalSets - 1}
              className={`flex items-center px-6 py-3 rounded-full ${currentSet === totalSets - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'} transition-colors duration-300 shadow-md`}
            >
              Next Set
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-md border border-purple-100">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span className="font-medium">Question Progress</span>
            <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium text-purple-800">
                {Object.keys(answeredQuestions).length} of {questions.length} Questions Answered
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-in-out shadow-sm"
                style={{ width: `${(Object.keys(answeredQuestions).length / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question dots */}
            <div className="flex justify-between w-full px-1 absolute -top-2 left-0 right-0">
              {questions.map((q, index) => {
                const isAnswered = answeredQuestions["q" + q.id] !== undefined;
                const isCurrentSet = index >= currentSet * questionsPerSet && index < (currentSet + 1) * questionsPerSet;

                return (
                  <div
                    key={index}
                    onClick={() => setCurrentSet(Math.floor(index / questionsPerSet))}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ${isAnswered ? 'bg-indigo-600 text-white' : isCurrentSet ? 'bg-pink-500 text-white animate-pulse' : 'bg-gray-300 text-gray-600'} shadow-md z-10 transition-all duration-300`}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress text */}
          <div className="text-center text-sm text-gray-600 italic">
            {Object.keys(answeredQuestions).length < questions.length ? (
              <span>Answer all questions to unlock your personality type</span>
            ) : (
              <span className="text-green-600 font-medium">All questions answered! You can now submit your results.</span>
            )}
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6 pt-8 pb-4 bg-white p-8 rounded-xl shadow-lg border border-purple-100 mb-10">
          <div className="mt-10">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <label
                  style={{ fontFamily: "Dancing Script, cursive" }}
                  className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient mb-2 inline-block"
                >
                  Your Gender <span className="text-red-500">*</span>
                </label>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full animate-gradient"></div>
              </div>
            </div>

            <div className="flex gap-6 items-center justify-center">
              <div className="relative flex flex-col items-center">
                <label className="cursor-pointer group w-full">
                  <input
                    type="radio"
                    className="peer sr-only" /* sr-only keeps it accessible but hidden */
                    value="Male"
                    {...register("gender", { required: true })}
                  />
                  <div className={`w-32 h-32 rounded-full border-2 ${errors.gender ? 'border-red-300' : 'border-gray-300'} flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-blue-400 peer-checked:border-blue-500 peer-checked:bg-blue-50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 group-hover:scale-110 transition-transform duration-300 peer-checked:scale-110" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="mt-2 text-lg font-medium text-gray-700 group-hover:text-blue-500 transition-colors duration-200 peer-checked:text-blue-600 peer-checked:font-bold">Male</span>
                </label>
              </div>

              <div className="relative flex flex-col items-center">
                <label className="cursor-pointer group w-full">
                  <input
                    type="radio"
                    className="peer sr-only" /* sr-only keeps it accessible but hidden */
                    value="Female"
                    {...register("gender", { required: true })}
                  />
                  <div className={`w-32 h-32 rounded-full border-2 ${errors.gender ? 'border-red-300' : 'border-gray-300'} flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-pink-400 peer-checked:border-pink-500 peer-checked:bg-pink-50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-500 group-hover:scale-110 transition-transform duration-300 peer-checked:scale-110" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="mt-2 text-lg font-medium text-gray-700 group-hover:text-pink-500 transition-colors duration-200 peer-checked:text-pink-600 peer-checked:font-bold">Female</span>
                </label>
              </div>
            </div>

            {errors.gender && (
              <div className="mt-4 max-w-xs mx-auto">
                <p className="text-center text-red-500 text-sm bg-red-50 py-2 px-3 rounded-md border border-red-200 shadow-sm animate-pulse">
                  <span className="inline-block mr-1">⚠️</span>
                  <span className="font-medium">Please select your gender - this field is required</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Name input moved to the end */}
        <div className="max-w-md mx-auto space-y-6 pt-8 pb-4 bg-white p-8 rounded-xl shadow-lg border border-purple-100 mb-10">
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <label
                htmlFor="name"
                style={{ fontFamily: "Dancing Script, cursive" }}
                className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient mb-2 inline-block"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full animate-gradient"></div>
            </div>
          </div>

          <div className="relative group">
            <input
            style={{ fontFamily: "Dancing Script, cursive" }}
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f66539] focus:border-transparent transition-all duration-300 bg-white bg-opacity-90 shadow-sm text-red-500 text-2xl"
              {...register("name", { required: "Please tell us your name" })}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#f66539] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {errors.name && (
            <p className="text-red-500 text-sm text-center mt-1 bg-red-50 py-1 px-2 rounded-md border border-red-200">
              <span className="inline-block mr-1">⚠️</span> {errors.name.message}
            </p>
          )}
        </div>

        {/* Submit button moved after name input */}
        <div className={`text-center pt-6 pb-8 ${Object.keys(answeredQuestions).length < questions.length ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="relative inline-block">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient text-white px-10 py-4 rounded-full text-xl font-medium shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} pulse-animation`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Discover Your Personality
                </span>
              )}
            </button>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 w-full">
              {Object.keys(answeredQuestions).length < questions.length ? (
                <span className="text-amber-600">Please answer all questions to continue</span>
              ) : (
                <span className="animate-pulse">✨ Find your perfect match ✨</span>
              )}
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}

export default PersonalityTest;