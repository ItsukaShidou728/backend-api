import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Masukkan link atau track ID di ?url=' });

  const trackId = (url.match(/[a-zA-Z0-9]{22}/) || [])[0];
  if (!trackId) return res.status(400).json({ error: 'Format link/ID tidak valid.' });

  try {
    const { data } = await axios.post(
      'https://parsevideoapi.videosolo.com/spotify-api/',
      { format: 'web', url: `https://open.spotify.com/track/${trackId}` },
      { headers: { 'user-agent': 'Postify/1.0.0', 'referer': 'https://spotidown.online/' } }
    );

    const meta = data?.data?.metadata;
    if (!meta) return res.status(404).json({ error: 'Track tidak ditemukan.' });

    res.json({
      status: true,
      trackId,
      title: meta.name,
      artist: meta.artist,
      album: meta.album,
      duration: meta.duration,
      image: meta.image,
      downloadUrl: meta.download
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memproses permintaan.' });
  }
});

export default router;
