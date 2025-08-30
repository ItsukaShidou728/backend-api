import express from 'express';
import { AnimeWallpaper, AnimeSource } from 'anime-wallpaper';

const router = express.Router();

// Endpoint untuk mencari wallpaper anime
router.get('/', async (req, res) => {
  const wall = new AnimeWallpaper();
  const { q } = req.query;

  // Pastikan query parameter 'q' ada
  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter q is required' });
  }

  try {
    // Mencari wallpaper berdasarkan judul
    const wallpaper = await wall.search(
      {
        title: q,
        page: 1,
        type: 'sfw',  // Hanya wallpaper yang aman
        aiArt: true    // Gunakan seni AI
      },
      AnimeSource.WallHaven // Sumber wallpaper dari WallHaven
    );

    // Mengembalikan hasil pencarian wallpaper
    return res.status(200).json({
      success: true,
      wallpaper: wallpaper,
    });
  } catch (error) {
    console.error('Error fetching wallpaper:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch wallpaper' });
  }
});

export default router;
