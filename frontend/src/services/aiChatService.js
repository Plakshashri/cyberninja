/**
 * AI Chat Service
 * 
 * This service provides AI-powered chat functionality for the dating app.
 * It generates contextually relevant responses based on MBTI personality types
 * and conversation context.
 */

// MBTI personality type characteristics and conversation styles
const mbtiProfiles = {
  // Analysts
  'INTJ': {
    name: 'The Architect',
    traits: ['strategic', 'logical', 'independent', 'determined', 'curious'],
    interests: ['science', 'technology', 'books', 'theoretical concepts', 'strategy games'],
    communicationStyle: 'direct and analytical',
    conversationTopics: [
      'future plans and goals',
      'intellectual discussions',
      'scientific advancements',
      'philosophical questions',
      'efficiency systems'
    ]
  },
  'INTP': {
    name: 'The Logician',
    traits: ['innovative', 'logical', 'contemplative', 'curious', 'objective'],
    interests: ['theoretical physics', 'philosophy', 'video games', 'puzzles', 'abstract concepts'],
    communicationStyle: 'analytical and exploratory',
    conversationTopics: [
      'thought experiments',
      'logical paradoxes',
      'technological innovations',
      'philosophical debates',
      'scientific theories'
    ]
  },
  'ENTJ': {
    name: 'The Commander',
    traits: ['decisive', 'strategic', 'efficient', 'charismatic', 'confident'],
    interests: ['business', 'leadership', 'debates', 'strategy', 'self-improvement'],
    communicationStyle: 'direct and confident',
    conversationTopics: [
      'career ambitions',
      'leadership strategies',
      'efficiency systems',
      'current events',
      'personal development'
    ]
  },
  'ENTP': {
    name: 'The Debater',
    traits: ['innovative', 'argumentative', 'curious', 'energetic', 'adaptable'],
    interests: ['debates', 'brainstorming', 'challenging ideas', 'comedy', 'innovation'],
    communicationStyle: 'playful and challenging',
    conversationTopics: [
      'controversial topics',
      'creative ideas',
      'theoretical possibilities',
      'intellectual challenges',
      'unconventional perspectives'
    ]
  },
  
  // Diplomats
  'INFJ': {
    name: 'The Advocate',
    traits: ['insightful', 'principled', 'creative', 'altruistic', 'complex'],
    interests: ['psychology', 'writing', 'helping others', 'deep conversations', 'arts'],
    communicationStyle: 'warm and insightful',
    conversationTopics: [
      'human connections',
      'personal growth',
      'social causes',
      'meaningful experiences',
      'future possibilities'
    ]
  },
  'INFP': {
    name: 'The Mediator',
    traits: ['idealistic', 'empathetic', 'creative', 'passionate', 'dedicated'],
    interests: ['creative writing', 'art', 'nature', 'personal growth', 'humanitarian causes'],
    communicationStyle: 'authentic and compassionate',
    conversationTopics: [
      'personal values',
      'creative pursuits',
      'emotional experiences',
      'meaningful connections',
      'idealistic visions'
    ]
  },
  'ENFJ': {
    name: 'The Protagonist',
    traits: ['charismatic', 'empathetic', 'inspiring', 'reliable', 'altruistic'],
    interests: ['community service', 'personal development', 'teaching', 'social events', 'motivational speaking'],
    communicationStyle: 'warm and encouraging',
    conversationTopics: [
      'personal growth',
      'helping others',
      'community building',
      'meaningful relationships',
      'inspirational stories'
    ]
  },
  'ENFP': {
    name: 'The Campaigner',
    traits: ['enthusiastic', 'creative', 'sociable', 'free-spirited', 'empathetic'],
    interests: ['creative projects', 'exploring new places', 'meeting people', 'personal expression', 'spontaneous activities'],
    communicationStyle: 'enthusiastic and expressive',
    conversationTopics: [
      'exciting possibilities',
      'creative ideas',
      'personal connections',
      'emotional experiences',
      'spontaneous adventures'
    ]
  },
  
  // Sentinels
  'ISTJ': {
    name: 'The Logistician',
    traits: ['practical', 'reliable', 'organized', 'dedicated', 'traditional'],
    interests: ['history', 'organization systems', 'practical hobbies', 'traditional activities', 'detailed work'],
    communicationStyle: 'clear and practical',
    conversationTopics: [
      'practical matters',
      'traditions and history',
      'reliable systems',
      'factual information',
      'real-world experiences'
    ]
  },
  'ISFJ': {
    name: 'The Defender',
    traits: ['protective', 'loyal', 'traditional', 'practical', 'detail-oriented'],
    interests: ['family activities', 'helping others', 'cooking', 'home improvement', 'traditions'],
    communicationStyle: 'warm and supportive',
    conversationTopics: [
      'family and friends',
      'practical support',
      'personal experiences',
      'traditions and memories',
      'day-to-day life'
    ]
  },
  'ESTJ': {
    name: 'The Executive',
    traits: ['organized', 'practical', 'direct', 'traditional', 'responsible'],
    interests: ['community organizations', 'sports', 'practical activities', 'leadership roles', 'traditional events'],
    communicationStyle: 'direct and structured',
    conversationTopics: [
      'practical plans',
      'organizational systems',
      'community events',
      'traditional values',
      'clear expectations'
    ]
  },
  'ESFJ': {
    name: 'The Consul',
    traits: ['caring', 'social', 'organized', 'traditional', 'practical'],
    interests: ['social gatherings', 'community service', 'family events', 'traditions', 'helping others'],
    communicationStyle: 'warm and considerate',
    conversationTopics: [
      'social events',
      'family and friends',
      'community matters',
      'practical support',
      'shared experiences'
    ]
  },
  
  // Explorers
  'ISTP': {
    name: 'The Virtuoso',
    traits: ['practical', 'logical', 'adaptable', 'spontaneous', 'independent'],
    interests: ['mechanics', 'hands-on activities', 'sports', 'troubleshooting', 'craftsmanship'],
    communicationStyle: 'straightforward and practical',
    conversationTopics: [
      'practical skills',
      'mechanical systems',
      'physical activities',
      'problem-solving',
      'hands-on experiences'
    ]
  },
  'ISFP': {
    name: 'The Adventurer',
    traits: ['artistic', 'sensitive', 'spontaneous', 'loyal', 'adaptable'],
    interests: ['art', 'music', 'nature', 'aesthetics', 'personal expression'],
    communicationStyle: 'gentle and authentic',
    conversationTopics: [
      'artistic pursuits',
      'aesthetic experiences',
      'personal values',
      'natural beauty',
      'sensory experiences'
    ]
  },
  'ESTP': {
    name: 'The Entrepreneur',
    traits: ['energetic', 'practical', 'spontaneous', 'adaptable', 'perceptive'],
    interests: ['sports', 'business ventures', 'physical activities', 'social events', 'practical skills'],
    communicationStyle: 'direct and energetic',
    conversationTopics: [
      'exciting activities',
      'practical opportunities',
      'physical challenges',
      'social events',
      'real-time experiences'
    ]
  },
  'ESFP': {
    name: 'The Entertainer',
    traits: ['spontaneous', 'energetic', 'friendly', 'adaptable', 'enthusiastic'],
    interests: ['performing arts', 'social events', 'fashion', 'trends', 'entertainment'],
    communicationStyle: 'enthusiastic and playful',
    conversationTopics: [
      'fun experiences',
      'social gatherings',
      'entertainment',
      'fashion and trends',
      'exciting stories'
    ]
  }
};

// Conversation context tracking
class ConversationContext {
  constructor() {
    this.topics = new Set();
    this.questions = [];
    this.sentiments = {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    this.personalInfo = {};
  }

  addTopic(topic) {
    this.topics.add(topic.toLowerCase());
  }

  hasTopic(topic) {
    return this.topics.has(topic.toLowerCase());
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  getLastQuestion() {
    return this.questions.length > 0 ? this.questions[this.questions.length - 1] : null;
  }

  updateSentiment(type) {
    this.sentiments[type]++;
  }

  getDominantSentiment() {
    const { positive, negative, neutral } = this.sentiments;
    if (positive > negative && positive > neutral) return 'positive';
    if (negative > positive && negative > neutral) return 'negative';
    return 'neutral';
  }

  addPersonalInfo(key, value) {
    this.personalInfo[key] = value;
  }

  getPersonalInfo(key) {
    return this.personalInfo[key];
  }
}

// Message analysis functions
const analyzeMessage = (message) => {
  const lowerCase = message.toLowerCase();
  
  // Detect topics
  const topics = [];
  if (/hobby|hobbies|interest|enjoy|like|passion/i.test(lowerCase)) topics.push('interests');
  if (/work|job|career|profession|study/i.test(lowerCase)) topics.push('career');
  if (/family|parent|sibling|brother|sister|mom|dad/i.test(lowerCase)) topics.push('family');
  if (/movie|film|show|watch|series|tv/i.test(lowerCase)) topics.push('entertainment');
  if (/food|eat|drink|restaurant|cook/i.test(lowerCase)) topics.push('food');
  if (/travel|trip|visit|country|place/i.test(lowerCase)) topics.push('travel');
  if (/book|read|author|novel|story/i.test(lowerCase)) topics.push('books');
  if (/music|song|band|artist|concert|listen/i.test(lowerCase)) topics.push('music');
  if (/sport|game|play|team|exercise|workout/i.test(lowerCase)) topics.push('sports');
  if (/date|relationship|together|meet|coffee/i.test(lowerCase)) topics.push('dating');
  if (/mbti|personality|type|compatible|introvert|extrovert/i.test(lowerCase)) topics.push('mbti');
  
  // Detect question
  const isQuestion = /\?|what|how|why|when|where|who|which|whose|whom|can you|could you|would you|will you/i.test(lowerCase);
  
  // Detect sentiment
  let sentiment = 'neutral';
  const positiveWords = ['happy', 'glad', 'excited', 'love', 'like', 'enjoy', 'wonderful', 'great', 'good', 'awesome', 'amazing', 'fantastic', 'excellent'];
  const negativeWords = ['sad', 'upset', 'angry', 'hate', 'dislike', 'terrible', 'bad', 'awful', 'horrible', 'disappointed', 'sorry', 'unfortunate'];
  
  const positiveCount = positiveWords.filter(word => lowerCase.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerCase.includes(word)).length;
  
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Detect personal info
  const personalInfo = {};
  const nameMatch = lowerCase.match(/my name is (\w+)|i'm (\w+)|i am (\w+)/);
  if (nameMatch) {
    const name = (nameMatch[1] || nameMatch[2] || nameMatch[3]);
    if (name && !['sure', 'sorry', 'just', 'not', 'really', 'actually'].includes(name)) {
      personalInfo.name = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  
  const ageMatch = lowerCase.match(/i am (\d+)|i'm (\d+)|(\d+) years old/);
  if (ageMatch) {
    personalInfo.age = ageMatch[1] || ageMatch[2] || ageMatch[3];
  }
  
  return {
    topics,
    isQuestion,
    sentiment,
    personalInfo
  };
};

// Response generation based on MBTI type
const generateResponse = (message, mbtiType, context) => {
  // Default to ENFJ if type not found
  const profile = mbtiProfiles[mbtiType] || mbtiProfiles['ENFJ'];
  const analysis = analyzeMessage(message);
  
  // Update conversation context
  analysis.topics.forEach(topic => context.addTopic(topic));
  if (analysis.isQuestion) context.addQuestion(message);
  context.updateSentiment(analysis.sentiment);
  Object.entries(analysis.personalInfo).forEach(([key, value]) => {
    context.addPersonalInfo(key, value);
  });
  
  // Generate appropriate response based on message content and MBTI type
  
  // Greeting patterns
  if (/^(hi|hello|hey|greetings|howdy)/i.test(message)) {
    const greetings = [
      `Hi there! It's nice to connect with you. As an ${profile.name} (${mbtiType}), I enjoy talking about ${profile.conversationTopics[0]} and ${profile.conversationTopics[1]}. How are you today?`,
      `Hello! I'm glad we matched. I'm a ${mbtiType}, which means I tend to be ${profile.traits[0]} and ${profile.traits[1]}. What about you?`,
      `Hey! Thanks for reaching out. I'd love to chat about ${profile.interests[0]} or ${profile.interests[1]} if you're interested?`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // MBTI-specific responses
  if (analysis.topics.includes('mbti')) {
    const mbtiResponses = [
      `As a ${mbtiType} (${profile.name}), I tend to be ${profile.traits[0]} and ${profile.traits[1]}. My communication style is usually ${profile.communicationStyle}. I think our personality types could be really compatible! What aspects of personality compatibility interest you?`,
      `Being a ${mbtiType} means I'm naturally ${profile.traits[0]} and often enjoy ${profile.interests[0]}. I find that understanding personality types helps me connect better with people. What's your experience with MBTI?`,
      `The ${mbtiType} personality type means I'm ${profile.traits[0]} and ${profile.traits[2]}. I'm curious about how our types might complement each other. What's your MBTI type?`
    ];
    return mbtiResponses[Math.floor(Math.random() * mbtiResponses.length)];
  }
  
  // Interest-based responses
  if (analysis.topics.includes('interests')) {
    const interestResponses = [
      `I'm really passionate about ${profile.interests[0]} and ${profile.interests[1]}. As a ${mbtiType}, I tend to be drawn to activities that let me be ${profile.traits[0]}. What kinds of things do you enjoy?`,
      `Some of my favorite things include ${profile.interests[0]} and ${profile.interests[2]}. I find they really satisfy my ${profile.traits[1]} side. Do we share any interests?`,
      `Being a ${mbtiType}, I naturally gravitate toward ${profile.interests[0]}. I also really enjoy ${profile.interests[3]} when I have the time. What about you?`
    ];
    return interestResponses[Math.floor(Math.random() * interestResponses.length)];
  }
  
  // Dating/meeting responses
  if (analysis.topics.includes('dating')) {
    const dateResponses = [
      `I'd definitely be interested in meeting up! As a ${mbtiType}, I enjoy ${profile.conversationTopics[0]} and would love to discuss that in person. What kind of date activities do you enjoy?`,
      `Meeting for coffee sounds great! ${profile.traits[0]} people like me tend to appreciate genuine connections. When were you thinking?`,
      `I'd love to get together sometime. Maybe we could do something related to ${profile.interests[0]}? That's always something I enjoy as a ${mbtiType}.`
    ];
    return dateResponses[Math.floor(Math.random() * dateResponses.length)];
  }
  
  // Question responses
  if (analysis.isQuestion) {
    const questionResponses = [
      `That's a great question! As a ${mbtiType}, I tend to think about things in a ${profile.communicationStyle} way. From my perspective, ${profile.conversationTopics[0]} is something I consider important. What do you think?`,
      `I'm glad you asked that. Being ${profile.traits[0]} and ${profile.traits[1]}, I would say that ${profile.conversationTopics[2]} plays a big role in how I approach that. How about for you?`,
      `Interesting question! My ${profile.traits[2]} nature makes me think that ${profile.conversationTopics[1]} is worth considering here. I'd love to hear your thoughts too.`
    ];
    return questionResponses[Math.floor(Math.random() * questionResponses.length)];
  }
  
  // Default responses based on MBTI communication style
  const defaultResponses = {
    // Analysts
    'INTJ': [
      `I've been thinking about ${profile.conversationTopics[0]} lately. It's a fascinating topic that requires strategic thinking.`,
      `I appreciate your logical approach to this conversation. Would you like to discuss ${profile.interests[0]} sometime?`,
      `That's an interesting perspective. I've been analyzing similar concepts related to ${profile.conversationTopics[1]}.`
    ],
    'INTP': [
      `That's a fascinating point. It makes me wonder about the theoretical implications for ${profile.conversationTopics[0]}.`,
      `I've been contemplating ${profile.interests[1]} recently. There are so many interesting possibilities to explore.`,
      `Your comment raises some intriguing logical questions. I enjoy these kinds of thought-provoking exchanges.`
    ],
    'ENTJ': [
      `I see great potential in this conversation. I'd like to discuss our ${profile.conversationTopics[0]} sometime.`,
      `I appreciate efficiency in communication. Let's plan to meet and talk more about ${profile.interests[0]}.`,
      `I have some strategic ideas about what you mentioned. Would you be interested in hearing my perspective?`
    ],
    'ENTP': [
      `That opens up so many possibilities to discuss! Have you considered the alternative perspective on ${profile.conversationTopics[0]}?`,
      `I love exploring new ideas like this. Let's debate the merits of ${profile.interests[1]} sometime.`,
      `Your message sparked several interesting tangents in my mind. Would you like to explore one of them further?`
    ],
    
    // Diplomats
    'INFJ': [
      `I feel like we're making a meaningful connection here. I'd love to hear more about your thoughts on ${profile.conversationTopics[0]}.`,
      `What you're saying resonates with me on a deeper level. I often reflect on ${profile.interests[0]} in a similar way.`,
      `I sense there's more to this conversation than what's on the surface. Would you like to explore that together?`
    ],
    'INFP': [
      `What you shared really aligns with my values. I find myself drawn to authentic conversations about ${profile.conversationTopics[0]}.`,
      `I appreciate how genuine you are in your messages. It inspires me to share my thoughts on ${profile.interests[0]} as well.`,
      `That's a beautiful perspective. I often express similar feelings through ${profile.interests[1]}.`
    ],
    'ENFJ': [
      `I really appreciate you sharing that with me! I can see how ${profile.conversationTopics[0]} is important to you.`,
      `I feel inspired by our conversation. Would you like to talk more about ${profile.interests[0]} sometime?`,
      `I see so much potential in our connection. How can I support your interest in ${profile.conversationTopics[1]}?`
    ],
    'ENFP': [
      `I'm so excited about this conversation! There are a million possibilities for where we could take this discussion about ${profile.conversationTopics[0]}!`,
      `I feel like we really connect on this topic! Would you like to explore ${profile.interests[0]} together sometime?`,
      `Your message sparked so many creative ideas! I'd love to share my thoughts on ${profile.conversationTopics[1]} with you!`
    ],
    
    // Sentinels
    'ISTJ': [
      `Based on my experience, ${profile.conversationTopics[0]} works best when approached systematically.`,
      `I appreciate your straightforward communication. Would you like to discuss ${profile.interests[0]} in more detail?`,
      `I find that reliable information about ${profile.conversationTopics[1]} is essential. What facts have you gathered?`
    ],
    'ISFJ': [
      `I'd be happy to help you with that. I have some experience with ${profile.conversationTopics[0]} that might be useful.`,
      `I remember you mentioned ${context.getLastQuestion() ? context.getLastQuestion() : 'that'} earlier. How is that going for you?`,
      `That reminds me of when I experienced something similar with ${profile.interests[0]}. Would you like to hear about it?`
    ],
    'ESTJ': [
      `Let's establish some concrete plans to meet and discuss ${profile.conversationTopics[0]}.`,
      `I have some practical suggestions for what you mentioned. Would you like me to share them?`,
      `Based on my experience with ${profile.interests[0]}, here's what works best in that situation.`
    ],
    'ESFJ': [
      `I'd love to introduce you to ${profile.conversationTopics[0]} sometime! I think you'd really enjoy it.`,
      `How are you feeling about everything we've discussed? I care about your perspective on ${profile.interests[0]}.`,
      `I'm organizing an event related to ${profile.interests[1]} soon - you should come! I think you'd fit right in.`
    ],
    
    // Explorers
    'ISTP': [
      `I've been working on a project involving ${profile.conversationTopics[0]}. It's been interesting to solve the practical challenges.`,
      `Let's cut to the chase and meet up to discuss ${profile.interests[0]} in person. I prefer action over too much discussion.`,
      `I have a hands-on solution for what you mentioned. Would you like me to explain how it works?`
    ],
    'ISFP': [
      `I had a similar experience with ${profile.conversationTopics[0]} recently. It was really meaningful to me.`,
      `I'd love to show you this place I discovered related to ${profile.interests[0]}. I think you'd appreciate its beauty.`,
      `Your message has a beautiful quality to it. It reminds me of my experience with ${profile.interests[1]}.`
    ],
    'ESTP': [
      `Let's meet up and do something exciting related to ${profile.conversationTopics[0]}! Why just talk about it?`,
      `I know a great place where we could experience ${profile.interests[0]} together. Are you up for an adventure?`,
      `I'm pretty spontaneous when it comes to ${profile.interests[1]}. Would you like to join me sometime?`
    ],
    'ESFP': [
      `That sounds like so much fun! We should definitely try ${profile.conversationTopics[0]} together sometime!`,
      `I know an amazing place where we could enjoy ${profile.interests[0]}! Would you like to go there with me?`,
      `Life's too short not to enjoy every moment! Let's make plans to experience ${profile.interests[1]} together!`
    ]
  };
  
  // Get responses for this MBTI type or use ENFJ as default
  const typeResponses = defaultResponses[mbtiType] || defaultResponses['ENFJ'];
  return typeResponses[Math.floor(Math.random() * typeResponses.length)];
};

// Export the AI chat service
export default {
  // Initialize a new conversation context
  createConversation: () => new ConversationContext(),
  
  // Generate a response based on the message, MBTI type, and conversation context
  generateResponse: (message, mbtiType, context) => {
    return generateResponse(message, mbtiType, context);
  },
  
  // Get information about an MBTI type
  getMbtiProfile: (mbtiType) => {
    return mbtiProfiles[mbtiType] || null;
  }
};
