import express from 'express';
import { fbdown } from 'btch-downloader'; // pastikan ini tersedia di modul-mu

const router = express.Router();

router.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in ?url=' });
  }

  try {
    const result = await fbdown(url);
    res.json(result);
  } catch (err) {
    console.error('Facebook download error:', err);
    res.status(500).json({ error: 'Failed to fetch Facebook video data' });
  }
});

export default router;
