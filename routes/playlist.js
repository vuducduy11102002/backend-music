// routes/playlist.js
const express = require('express');
const playlistController = require('../controllers/playlistController');

const router = express.Router();

// Create a new playlist
router.post('/', playlistController.createPlaylist);

// Get all playlists
router.get('/', playlistController.getAllPlaylists);

// Get playlist by ID
router.get('/:playlistId', playlistController.getPlaylistById);

// Add song to playlist
router.post('/add-song', playlistController.addSongToPlaylist);


module.exports = router;