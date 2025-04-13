const Mbti = require('../models/Mbti');
const User = require('../models/User');

// Save MBTI test result
const saveResult = async (req, res) => {
  try {
    const { name, gender, result, scores } = req.body;

    // Validate required fields
    if (!name || !result) {
      return res.status(400).json({ message: 'Name and result are required' });
    }

    // Set default gender if not provided
    const userGender = gender || 'Not specified';

    // Create new MBTI result
    const mbtiResult = new Mbti({
      name,
      gender: userGender,
      result,
      scores
    });

    // Check if a userId is provided in the request body
    const { userId } = req.body;

    // If user is logged in or userId is provided, associate with user ID
    if (req.user) {
      mbtiResult.userId = req.user._id;
    } else if (userId) {
      mbtiResult.userId = userId;
    }

    // Save MBTI result to database
    const savedResult = await mbtiResult.save();

    // If there's a userId, update the User model to reference this MBTI result
    if (mbtiResult.userId) {
      try {
        const user = await User.findById(mbtiResult.userId);
        if (user) {
          // Add this MBTI result to the user's mbtiResults array
          user.mbtiResults.push(savedResult._id);

          // Update the user's current MBTI type
          user.currentMbtiType = result;

          await user.save();
          console.log(`Updated user ${user.username} with new MBTI result: ${result}`);
        }
      } catch (userError) {
        console.error('Error updating user with MBTI result:', userError);
        // We don't want to fail the whole request if just the user update fails
      }
    }

    res.status(201).json({
      message: 'MBTI result saved successfully',
      data: savedResult
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving MBTI result',
      error: error.message
    });
  }
};

// Get all MBTI results
const getAllResults = async (req, res) => {
  try {
    const results = await Mbti.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching MBTI results',
      error: error.message
    });
  }
};

// Get MBTI results for a specific user
const getUserResults = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user and populate their MBTI results
    const user = await User.findById(userId).populate('mbtiResults');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.mbtiResults || user.mbtiResults.length === 0) {
      return res.status(404).json({ message: 'No MBTI results found for this user' });
    }

    res.status(200).json({
      currentMbtiType: user.currentMbtiType,
      results: user.mbtiResults
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user MBTI results',
      error: error.message
    });
  }
};

// Get current MBTI type for a user
const getUserCurrentMbti = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('currentMbtiType');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.currentMbtiType) {
      return res.status(404).json({ message: 'No MBTI type found for this user' });
    }

    res.status(200).json({ mbtiType: user.currentMbtiType });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user MBTI type',
      error: error.message
    });
  }
};

module.exports = {
  saveResult,
  getAllResults,
  getUserResults,
  getUserCurrentMbti
};
