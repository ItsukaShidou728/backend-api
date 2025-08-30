import express from 'express';
import { ttdl } from 'btch-downloader';

const router = express.Router();

router.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in ?url=' });
  }

  try {
    const data = await ttdl(url);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;
