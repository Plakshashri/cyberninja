const User = require('../models/User');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      console.log("User saved");
      res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
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
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
module.exports = { signup, login };