import express from 'express';
import FongsiDev_Scraper from '@fongsidev/scraper';

const router = express.Router();

// Endpoint Twitter Downloader
router.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL Twitter diperlukan!' });
  }

  try {
    const data = await FongsiDev_Scraper.Twitter(url);
    res.json({ message: 'Data berhasil diambil', data });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data Twitter', details: error.message });
  }
});

export default router;
