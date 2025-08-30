import express from 'express';
import pkg from 'api-dylux';

const { soundcloudDl } = pkg; // Ekstrak soundcloudDl dari api-dylux
const router = express.Router();

// Endpoint SoundCloud Downloader
router.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL SoundCloud diperlukan!' });
  }

  try {
    const data = await soundcloudDl(url);
    res.json({ message: 'Data berhasil diambil', data });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data SoundCloud', details: error.message });
  }
});

export default router;
