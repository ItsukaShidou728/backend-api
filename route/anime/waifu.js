import express from 'express';
import axios from 'axios';

const router = express.Router();
const apiUrl = 'https://api.waifu.pics/sfw/waifu';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(apiUrl);
    const imageUrl = response.data.url;

    if (!imageUrl) {
      return res.status(500).json({ status: false, message: 'URL gambar tidak ditemukan' });
    }

    // Kirim data dalam format JSON saja
    res.json({
      status: true,
      result: {
        url: imageUrl,
        extension: imageUrl.split('.').pop()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Gagal mengambil gambar' });
  }
});

export default router;
