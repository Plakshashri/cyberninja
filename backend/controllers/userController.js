const User = require('../models/User');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`Signup attempt with existing username: ${username}`);
      return res.status(409).json({ message: 'User already exists' });
    }

    // Validate required fields
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username, and password are required' });
    }

    // If username is unique, proceed with user creation
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password: hashedPassword });
    await user.save();
    console.log(`New user created: ${username} (${name})`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if the username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: "Please provide both username and password." });
        }
        // Find the user by username
        const user = await User.findOne({ username }).select('+password +currentMbtiType +_id');
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Prepare response with user data
        const userData = {
            userId: user._id,
            username: user.username,
            mbtiType: user.currentMbtiType || null
        };

        res.status(200).json({
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
module.exports = { signup, login };