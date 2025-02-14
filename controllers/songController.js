// controllers/songController.js
const AWS = require('aws-sdk');
const Song = require('../models/Song');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Function to get a signed URL for streaming music from S3
exports.getSignedUrl = async (req, res) => {
    try {
        const key = req.query.key; // S3 key of the song
        if (!key) {
            return res.status(400).json({ message: 'S3 key is required' });
        }

        const params = {
            Bucket: bucketName,
            Key: key,
            Expires: 60 * 5 // URL expires in 5 minutes
        };

        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        res.json({ signedUrl });
    } catch (err) {
        console.error("Error generating signed URL:", err);
        res.status(500).json({ message: 'Error generating signed URL', error: err });
    }
};

// Upload a new song to S3 and save song details to MongoDB
exports.uploadSong = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const fileContent = req.file.buffer;
        const key = `songs/${Date.now()}-${req.file.originalname}`; // Unique S3 key

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ACL: 'public-read' // Or 'private' and use signed URLs for access if you want more control
        };

        await s3.upload(params).promise();

        // Save song details to MongoDB
        const { title, artist, genre } = req.body;
        const newSong = new Song({
            title,
            artist,
            genre,
            s3Key: key
        });

        await newSong.save();

        res.status(201).json({ message: 'Song uploaded successfully', song: newSong });

    } catch (err) {
        console.error("Error uploading song:", err);
        res.status(500).json({ message: 'Error uploading song', error: err });
    }
};

// Get all songs (for listing, etc.)
exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching songs', error: err });
    }
};

// Get song by ID
exports.getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.json(song);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching song', error: err });
    }
};

// Increment listen count
exports.incrementListenCount = async (req, res) => {
    try {
        const song = await Song.findById(req.params.songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        song.listenCount += 1;
        await song.save();

        res.json({ message: 'Listen count incremented', song });

    } catch (err) {
        res.status(500).json({ message: 'Error updating listen count', error: err });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        // Simplified recommendation logic: Fetch first 10 songs
        const recommendedSongs = await Song.find({}).limit(10);

        res.json({ recommendations: recommendedSongs });

    } catch (err) {
        console.error("Error getting recommendations (Simplified):", err);
        console.error("Full error object (Simplified):", err);
        res.status(500).json({ message: 'Error getting recommendations', error: err });
    }
};