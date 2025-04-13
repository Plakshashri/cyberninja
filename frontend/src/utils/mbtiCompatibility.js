const idealMatches = {
  // Analysts
  'INTJ': ['ENFP', 'ENTP'],
  'INTP': ['ENFJ', 'ENTJ'],
  'ENTJ': ['INFP', 'INTP'],
  'ENTP': ['INFJ', 'INTJ'],
  
  // Diplomats
  'INFJ': ['ENTP', 'ENFP'],
  'INFP': ['ENTJ', 'ENFJ'],
  'ENFJ': ['INTP', 'INFP'],
  'ENFP': ['INTJ', 'INFJ'],
  
  // Sentinels
  'ISTJ': ['ESFP', 'ESTP'],
  'ISFJ': ['ESFP', 'ESTP'],
  'ESTJ': ['ISFP', 'ISTP'],
  'ESFJ': ['ISFP', 'ISTP'],
  
  // Explorers
  'ISTP': ['ESFJ', 'ESTJ'],
  'ISFP': ['ESFJ', 'ESTJ'],
  'ESTP': ['ISFJ', 'ISTJ'],
  'ESFP': ['ISFJ', 'ISTJ']
};

// Define good matches (not ideal but still compatible)
const goodMatches = {
  // Analysts
  'INTJ': ['INFJ', 'INFP', 'ENTJ', 'INTP'],
  'INTP': ['INTJ', 'INFP', 'ENTP', 'INFJ'],
  'ENTJ': ['INTJ', 'ENFJ', 'ENTP', 'ESTJ'],
  'ENTP': ['INTP', 'ENFP', 'ENTJ', 'ENFJ'],
  
  // Diplomats
  'INFJ': ['INTJ', 'INFP', 'ENFJ', 'INTP'],
  'INFP': ['INFJ', 'INTP', 'ENFP', 'INTJ'],
  'ENFJ': ['INFP', 'ENFP', 'ENTJ', 'INFJ'],
  'ENFP': ['INFP', 'ENFJ', 'ENTP', 'INFJ'],
  
  // Sentinels
  'ISTJ': ['ESTJ', 'ISFJ', 'ISTP', 'ISFP'],
  'ISFJ': ['ISTJ', 'ESFJ', 'ISFP', 'ISTP'],
  'ESTJ': ['ISTJ', 'ESFJ', 'ESTP', 'ENTJ'],
  'ESFJ': ['ISFJ', 'ESTJ', 'ESFP', 'ISFP'],
  
  // Explorers
  'ISTP': ['ISTJ', 'ESTP', 'ISFP', 'ISFJ'],
  'ISFP': ['ISFJ', 'ESFP', 'ISTP', 'ISTJ'],
  'ESTP': ['ISTP', 'ESTJ', 'ESFP', 'ISTJ'],
  'ESFP': ['ISFP', 'ESFJ', 'ESTP', 'ISFJ']
};

/**
 * Determines the compatibility level between two MBTI types
 * @param {string} type1 - First MBTI type (e.g., 'INTJ')
 * @param {string} type2 - Second MBTI type (e.g., 'ENFP')
 * @returns {string} - Compatibility level: 'ideal', 'good', or 'low'
 */
export const getCompatibilityLevel = (type1, type2) => {
  // Normalize types to uppercase
  const mbti1 = type1.toUpperCase();
  const mbti2 = type2.toUpperCase();
  
  // Check if they are ideal matches
  if (idealMatches[mbti1] && idealMatches[mbti1].includes(mbti2)) {
    return 'ideal';
  }
  
  // Check if they are good matches
  if (goodMatches[mbti1] && goodMatches[mbti1].includes(mbti2)) {
    return 'good';
  }
  
  // Otherwise, they have low compatibility
  return 'low';
};

/**
 * Checks if two MBTI types are compatible (ideal or good match)
 * @param {string} type1 - First MBTI type
 * @param {string} type2 - Second MBTI type
 * @returns {boolean} - True if compatible, false otherwise
 */
export const areCompatible = (type1, type2) => {
  const compatibilityLevel = getCompatibilityLevel(type1, type2);
  return compatibilityLevel === 'ideal' || compatibilityLevel === 'good';
};

/**
 * Gets a description of why two types are compatible
 * @param {string} type1 - First MBTI type
 * @param {string} type2 - Second MBTI type
 * @returns {string} - Compatibility description
 */
export const getCompatibilityDescription = (type1, type2) => {
  const level = getCompatibilityLevel(type1, type2);
  
  if (level === 'ideal') {
    return `${type1} and ${type2} are ideal matches! They complement each other's strengths and weaknesses perfectly.`;
  } else if (level === 'good') {
    return `${type1} and ${type2} are good matches. They have enough similarities to understand each other and enough differences to grow together.`;
  } else {
    return `${type1} and ${type2} may face some challenges in understanding each other's perspectives, but all relationships require work!`;
  }
};

export default {
  getCompatibilityLevel,
  areCompatible,
  getCompatibilityDescription
};
