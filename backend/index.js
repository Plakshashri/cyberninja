
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors()); // Enable CORS for all origins


const port = 3000;
const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://TimeWalker:Nisshchaya4%40@cluster0.41blq.mongodb.net/newproject', {
    });
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
}
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/mbti', require('./routes/mbtiRoutes'));
connectToDatabase();