const express = require('express');
const router = express.Router();
const mbtiController = require('../controllers/mbtiController');

// Save MBTI test result
router.post('/result', mbtiController.saveResult);

// Get all MBTI results
router.get('/', mbtiController.getAllResults);

// Get MBTI results for a specific user
router.get('/user/:userId', mbtiController.getUserResults);

// Get current MBTI type for a specific user
router.get('/user/:userId/current', mbtiController.getUserCurrentMbti);

module.exports = router;
