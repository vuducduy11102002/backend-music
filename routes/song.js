// routes/song.js
const express = require('express');
const songController = require('../controllers/songController');
const multer = require('multer'); // For handling file uploads

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory for S3 upload

// Get signed URL for streaming
router.get('/signed-url', songController.getSignedUrl);

// Upload a new song
router.post('/upload', upload.single('audioFile'), songController.uploadSong); // 'audioFile' is the field name for the file in FormData

// Get all songs
router.get('/', songController.getAllSongs);
router.get('/recommendations', songController.getRecommendations);

// Get song by ID
router.get('/:songId', songController.getSongById);

// Increment listen count
router.post('/:songId/listen', songController.incrementListenCount);

// Get song recommendations


module.exports = router;