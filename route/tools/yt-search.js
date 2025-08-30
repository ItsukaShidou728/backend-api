import express from 'express';
import ytSearch from 'yt-search';

const router = express.Router();

// Endpoint: /yt-search?q=kata_kunci
router.get('/', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, message: 'Parameter q diperlukan' });

  try {
    const result = await ytSearch(q);
    if (!result.videos || result.videos.length === 0) {
      return res.status(404).json({ status: false, message: 'Video tidak ditemukan' });
    }

    // Ambil 1 hasil teratas
    const video = result.videos[0];

    res.json({
      status: true,
      title: video.title,
      description: video.description,
      duration: video.timestamp,
      views: video.views,
      uploadedAt: video.ago,
      author: video.author.name,
      channelId: video.author.url,
      videoId: video.videoId,
      url: video.url,
      image: video.image,
    });
  } catch (e) {
    res.status(500).json({ status: false, message: 'Gagal mengambil data dari YouTube' });
  }
});

export default router;
