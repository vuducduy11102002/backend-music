// index.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const songRoutes = require('./routes/song');
const playlistRoutes = require('./routes/playlist');

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies


// Use routes
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);


app.get('/', (req, res) => {
    res.send('Music Streaming Backend is running!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});