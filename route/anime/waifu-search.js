import express from 'express';
import axios from 'axios';

const router = express.Router();

// Endpoint: /api/setu?q=keyword
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    // Default ke "nahida" jika q kosong
    const keyword = q?.trim() || 'nahida';

    const encodedQuery = encodeURIComponent(keyword);
    const apiUrl = `https://api.lolicon.app/setu/v2?keyword=${encodedQuery}&size=original&r18=0`;

    const response = await axios.get(apiUrl);

    if (!response.data || response.data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Gambar tidak ditemukan untuk keyword "${keyword}"`,
      });
    }

    res.status(200).json({
      success: true,
      keyword,
      result: response.data.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dari API',
      error: error.message,
    });
  }
});

export default router;
