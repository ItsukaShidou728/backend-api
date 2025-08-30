import express from 'express';
import axios from 'axios';

const router = express.Router();

// Endpoint untuk mendapatkan gambar lolicon
router.get('/', async (req, res) => {
  try {
    // Mengirim permintaan ke API lolicon.app
    const response = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon');

    if (!response.data || response.data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gambar tidak ditemukan',
      });
    }

    // Kirimkan JSON respons API tanpa perubahan
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dari API',
      error: error.message,
    });
  }
});

export default router;
