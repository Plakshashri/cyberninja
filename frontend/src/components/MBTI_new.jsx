import React, { useState, useEffect } from 'react';
import './MBTIStyles.css';

// MBTI type data with descriptions, traits, and compatibility
const mbtiData = [
  {
    type: "ISTJ",
    nickname: "The Inspector",
    description: "Practical and fact-minded individuals, whose reliability cannot be doubted. They value traditions and loyalty, and are known for their quiet, serious, and methodical approach to life.",
    traits: ["Organized", "Reliable", "Logical", "Dutiful", "Traditional"],
    compatibleWith: ["ESFP", "ESTP"],
    strengths: "Detail-oriented, responsible, reliable, organized, logical",
    weaknesses: "Stubborn, insensitive, judgmental, inflexible",
    careers: "Accountant, Auditor, Financial Analyst, Project Manager, Military Officer"
  },
  {
    type: "ISFJ",
    nickname: "The Protector",
    description: "Very dedicated and warm protectors, always ready to defend their loved ones. They are quiet, kind, and conscientious individuals who value harmony and security.",
    traits: ["Supportive", "Reliable", "Observant", "Patient", "Detail-oriented"],
    compatibleWith: ["ESFP", "ESTP"],
    strengths: "Supportive, reliable, patient, devoted, observant",
    weaknesses: "Overworked, shy, taking criticism personally, reluctant to change",
    careers: "Nurse, Elementary Teacher, Social Worker, HR Manager, Interior Designer"
  },
  {
    type: "INFJ",
    nickname: "The Counselor",
    description: "Quiet and mystical, yet very inspiring and tireless idealists. They seek meaning and connection in ideas, relationships, and material possessions.",
    traits: ["Insightful", "Creative", "Principled", "Passionate", "Altruistic"],
    compatibleWith: ["ENTP", "ENFP"],
    strengths: "Creative, insightful, principled, passionate, altruistic",
    weaknesses: "Sensitive to criticism, perfectionist, burnout-prone, private",
    careers: "Counselor, Psychologist, Writer, HR Developer, Professor"
  },
  {
    type: "INTJ",
    nickname: "The Mastermind",
    description: "Imaginative and strategic thinkers, with a plan for everything. They are independent, analytical, and determined in pursuing their vision of how things should be.",
    traits: ["Strategic", "Independent", "Innovative", "Analytical", "Determined"],
    compatibleWith: ["ENFP", "ENTP"],
    strengths: "Strategic, independent, innovative, analytical, determined",
    weaknesses: "Arrogant, dismissive of emotions, overly critical, combative",
    careers: "Scientist, Engineer, Judge, Software Developer, Investment Banker"
  },
  {
    type: "ISTP",
    nickname: "The Craftsman",
    description: "Bold and practical experimenters, masters of all kinds of tools. They are logical problem-solvers who excel at finding solutions in the moment.",
    traits: ["Adaptable", "Observant", "Practical", "Logical", "Spontaneous"],
    compatibleWith: ["ESFJ", "ESTJ"],
    strengths: "Optimistic, energetic, creative, practical, spontaneous",
    weaknesses: "Stubborn, insensitive, risk-prone, impatient, commitment-phobic",
    careers: "Mechanic, Engineer, Pilot, Carpenter, Graphic Designer"
  },
  {
    type: "ISFP",
    nickname: "The Composer",
    description: "Flexible and charming artists, always ready to explore and experience something new. They live in the present moment and enjoy their surroundings with cheerful, quiet enthusiasm.",
    traits: ["Artistic", "Sensitive", "Gentle", "Spontaneous", "Loyal"],
    compatibleWith: ["ESFJ", "ESTJ"],
    strengths: "Artistic, sensitive, passionate, imaginative, loyal",
    weaknesses: "Unpredictable, easily stressed, fiercely independent, conflict-avoidant",
    careers: "Artist, Designer, Photographer, Veterinarian, Physical Therapist"
  },
  {
    type: "INFP",
    nickname: "The Healer",
    description: "Poetic, kind and altruistic people, always eager to help a good cause. They seek to understand people and help them fulfill their potential.",
    traits: ["Idealistic", "Empathetic", "Creative", "Passionate", "Dedicated"],
    compatibleWith: ["ENTJ", "ENFJ"],
    strengths: "Empathetic, generous, creative, idealistic, devoted to values",
    weaknesses: "Unrealistic, self-isolating, unfocused, emotionally vulnerable",
    careers: "Writer, Counselor, Social Worker, Professor, Graphic Designer"
  },
  {
    type: "INTP",
    nickname: "The Architect",
    description: "Innovative inventors with an unquenchable thirst for knowledge. They are the most logical of all personality types, with a remarkable ability to analyze complex problems.",
    traits: ["Analytical", "Objective", "Conceptual", "Logical", "Adaptable"],
    compatibleWith: ["ENFJ", "ENTJ"],
    strengths: "Analytical, original, open-minded, curious, objective",
    weaknesses: "Insensitive, absent-minded, condescending, loathing rules",
    careers: "Computer Programmer, Mathematician, Professor, Economist, Architect"
  },
  {
    type: "ESTP",
    nickname: "The Dynamo",
    description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge. They notice details others might miss and have a practical approach to problem-solving.",
    traits: ["Energetic", "Adaptable", "Observant", "Persuasive", "Spontaneous"],
    compatibleWith: ["ISFJ", "ISTJ"],
    strengths: "Bold, rational, practical, original, perceptive",
    weaknesses: "Impatient, risk-prone, unstructured, defiant, insensitive",
    careers: "Entrepreneur, Marketer, Detective, Paramedic, Sales Representative"
  },
  {
    type: "ESFP",
    nickname: "The Performer",
    description: "Spontaneous, energetic and enthusiastic people – life is never boring around them. They are vivacious entertainers who charm and engage those around them.",
    traits: ["Enthusiastic", "Friendly", "Spontaneous", "Tactile", "Observant"],
    compatibleWith: ["ISFJ", "ISTJ"],
    strengths: "Bold, original, aesthetic, showmanship, practical",
    weaknesses: "Sensitive to criticism, easily bored, poor long-term planning",
    careers: "Event Planner, Tour Guide, Personal Trainer, Actor, Flight Attendant"
  },
  {
    type: "ENFP",
    nickname: "The Champion",
    description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile. They are warm, passionate, and charismatic individuals.",
    traits: ["Creative", "Enthusiastic", "Empathetic", "Curious", "Spontaneous"],
    compatibleWith: ["INTJ", "INFJ"],
    strengths: "Curious, perceptive, enthusiastic, excellent communicators",
    weaknesses: "Unfocused, disorganized, people-pleasing, overthinking",
    careers: "Journalist, Actor, Consultant, Counselor, Marketing Director"
  },
  {
    type: "ENTP",
    nickname: "The Visionary",
    description: "Smart and curious thinkers who cannot resist an intellectual challenge. They are innovative, entrepreneurial, and inventive in finding creative solutions.",
    traits: ["Innovative", "Analytical", "Enterprising", "Debative", "Charismatic"],
    compatibleWith: ["INFJ", "INTJ"],
    strengths: "Knowledgeable, quick thinkers, charismatic, energetic",
    weaknesses: "Argumentative, insensitive, intolerant, unfocused",
    careers: "Entrepreneur, Lawyer, Engineer, Creative Director, Systems Analyst"
  },
  {
    type: "ESTJ",
    nickname: "The Supervisor",
    description: "Excellent administrators, unsurpassed at managing things or people. They are organized, dedicated, and practical individuals who value tradition and order.",
    traits: ["Organized", "Practical", "Logical", "Outspoken", "Dedicated"],
    compatibleWith: ["ISFP", "ISTP"],
    strengths: "Dedicated, strong-willed, direct, honest, loyal",
    weaknesses: "Inflexible, stubborn, judgmental, unforgiving",
    careers: "Business Administrator, Judge, School Principal, Financial Officer, Military Officer"
  },
  {
    type: "ESFJ",
    nickname: "The Provider",
    description: "Extraordinarily caring, social and popular people, always eager to help. They are warm-hearted and conscientious individuals who value harmony and cooperation.",
    traits: ["Supportive", "Reliable", "Conscientious", "Organized", "Harmonious"],
    compatibleWith: ["ISFP", "ISTP"],
    strengths: "Strong practical skills, sensitive, warm, connecting",
    weaknesses: "Worried about their social status, inflexible, vulnerable to criticism",
    careers: "Nurse, Teacher, Social Worker, HR Specialist, Healthcare Administrator"
  },
  {
    type: "ENFJ",
    nickname: "The Teacher",
    description: "Charismatic and inspiring leaders, able to mesmerize their listeners. They are natural mentors, sensitive to the needs of others and adept at helping people reach their potential.",
    traits: ["Charismatic", "Empathetic", "Organized", "Inspiring", "Reliable"],
    compatibleWith: ["INFP", "ISFP"],
    strengths: "Tolerant, reliable, charismatic, altruistic, natural leaders",
    weaknesses: "Overly idealistic, too selfless, overcommitting, approval-seeking",
    careers: "Teacher, HR Manager, Counselor, Marketing Manager, Public Relations Specialist"
  },
  {
    type: "ENTJ",
    nickname: "The Commander",
    description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one. They are strategic thinkers who value knowledge, competence, and structure.",
    traits: ["Strategic", "Efficient", "Energetic", "Objective", "Decisive"],
    compatibleWith: ["INFP", "INTP"],
    strengths: "Efficient, energetic, self-confident, strong-willed, strategic",
    weaknesses: "Stubborn, dominant, intolerant, impatient, arrogant",
    careers: "Executive, Lawyer, Entrepreneur, Management Consultant, Business Analyst"
  }
];

const Mbti = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredTypes, setFilteredTypes] = useState(mbtiData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Filter types based on active filter
    if (activeFilter === 'all') {
      setFilteredTypes(mbtiData);
    } else {
      setFilteredTypes(mbtiData.filter(type => type.type.startsWith(activeFilter)));
    }
  }, [activeFilter]);

  useEffect(() => {
    // Set loaded state after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`mbti-container ${isLoaded ? 'fade-in' : ''}`}>
      <div className="mbti-header">
        <h1 className="mbti-title">Discover Your Personality Type</h1>
        <p className="mbti-subtitle">
          The Myers-Briggs Type Indicator (MBTI) is a personality assessment that helps you understand your preferences, 
          strengths, and potential areas for growth. Explore all 16 personality types below to learn more about yourself 
          and how you relate to others.
        </p>
      </div>

      <div className="mbti-filters">
        <button 
          className={`mbti-filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Types
        </button>
        <button 
          className={`mbti-filter-button ${activeFilter === 'I' ? 'active' : ''}`}
          onClick={() => setActiveFilter('I')}
        >
          Introverts (I)
        </button>
        <button 
          className={`mbti-filter-button ${activeFilter === 'E' ? 'active' : ''}`}
          onClick={() => setActiveFilter('E')}
        >
          Extroverts (E)
        </button>
        <button 
          className={`mbti-filter-button ${activeFilter === 'IN' ? 'active' : ''}`}
          onClick={() => setActiveFilter('IN')}
        >
          Intuitive Introverts (IN)
        </button>
        <button 
          className={`mbti-filter-button ${activeFilter === 'EN' ? 'active' : ''}`}
          onClick={() => setActiveFilter('EN')}
        >
          Intuitive Extroverts (EN)
        </button>
        <button 
          className={`mbti-filter-button ${activeFilter === 'IS' ? 'active' : ''}`}
          onClick={() => setActiveFilter('IS')}
        >
          Sensing Introverts (IS)
        </button>
        <button 
          className={`mbti-filter-button ${activeFilter === 'ES' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ES')}
        >
          Sensing Extroverts (ES)
        </button>
      </div>

      <div className="mbti-grid">
        {filteredTypes.map((type, index) => (
          <div 
            key={type.type} 
            className={`mbti-card ${type.type.toLowerCase()}`}
            style={{
              '--index': index,
            }}
          >
            <div className="mbti-card-header">
              {/* SVG placeholder - you'll add your SVGs here */}
              <div className="mbti-card-svg-container">
                {/* Your SVG will go here */}
                <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#666' }}>{type.type}</span>
                </div>
              </div>
              <h2 className="mbti-card-type">{type.type}</h2>
              <p className="mbti-card-nickname">{type.nickname}</p>
            </div>

            <div className="mbti-card-content">
              <p className="mbti-card-description">{type.description}</p>
              
              <div className="mbti-card-traits">
                {type.traits.map(trait => (
                  <span key={trait} className="mbti-card-trait">{trait}</span>
                ))}
              </div>
            </div>

            <div className="mbti-card-footer">
              <span className="mbti-card-compatibility">Compatible with:</span>
              <div className="mbti-card-compatibility-types">
                {type.compatibleWith.map(compatType => (
                  <span key={compatType} className="mbti-card-compatibility-type">{compatType}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mbti-header" style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Understanding MBTI Dimensions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', marginBottom: '0.75rem', color: '#4b5563' }}>Extraversion (E) vs. Introversion (I)</h3>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6 }}>
              This dimension reflects where you get your energy. Extraverts gain energy from social interactions and the external world, while Introverts recharge through solitude and their inner world of ideas.
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', marginBottom: '0.75rem', color: '#4b5563' }}>Sensing (S) vs. Intuition (N)</h3>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6 }}>
              This dimension concerns how you process information. Sensing types focus on concrete facts and details in the present, while Intuitive types prefer abstract concepts, patterns, and future possibilities.
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', marginBottom: '0.75rem', color: '#4b5563' }}>Thinking (T) vs. Feeling (F)</h3>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6 }}>
              This dimension reflects how you make decisions. Thinking types prioritize logic, consistency, and objective criteria, while Feeling types emphasize values, harmony, and the impact on people.
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', marginBottom: '0.75rem', color: '#4b5563' }}>Judging (J) vs. Perceiving (P)</h3>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6 }}>
              This dimension shows how you approach the external world. Judging types prefer structure, planning, and closure, while Perceiving types value flexibility, spontaneity, and keeping options open.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mbti;
