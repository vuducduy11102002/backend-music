// controllers/playlistController.js
const Playlist = require('../models/Playlist');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        const newPlaylist = new Playlist({ name });
        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (err) {
        res.status(500).json({ message: 'Error creating playlist', error: err });
    }
};

// Get all playlists
exports.getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs'); // Populate songs in playlists
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching playlists', error: err });
    }
};

// Get playlist by ID
exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching playlist', error: err });
    }
};


// Add a song to a playlist
exports.addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const songExists = playlist.songs.includes(songId);
        if (songExists) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        playlist.songs.push(songId);
        await playlist.save();
        res.json({ message: 'Song added to playlist', playlist });

    } catch (err) {
        res.status(500).json({ message: 'Error adding song to playlist', error: err });
    }
};