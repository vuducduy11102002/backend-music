// models/Song.js
const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: String,
    genre: String,
    s3Key: { // Key in S3 bucket
        type: String,
        required: true
    },
    lyricFile: { // Optional: S3 key for lyrics file
        type: String
    },
    listenCount: { // To track genre popularity for recommendations
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Song', SongSchema);