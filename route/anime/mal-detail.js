import express from 'express';
import axios from 'axios';
const router = express.Router();

// Endpoint: /myanilist/detail?query=nama_anime
router.get('/', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, message: 'Parameter q diperlukan' });
  try {
    // Menggunakan Jikan API (unofficial MyAnimeList API)
    const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);
    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ status: false, message: 'Anime tidak ditemukan' });
    }
    const anime = data.data[0];
    res.json({
      status: true,
      title: anime.title,
      title_english: anime.title_english,
      title_japanese: anime.title_japanese,
      synopsis: anime.synopsis,
      type: anime.type,
      episodes: anime.episodes,
      status_anime: anime.status,
      rating: anime.rating,
      score: anime.score,
      scored_by: anime.scored_by,
      rank: anime.rank,
      popularity: anime.popularity,
      members: anime.members,
      favorites: anime.favorites,
      season: anime.season,
      year: anime.year,
      studios: anime.studios.map(s => s.name),
      genres: anime.genres.map(g => g.name),
      image: anime.images.jpg.image_url,
      url: anime.url
    });
  } catch (e) {
    res.status(500).json({ status: false, message: 'Gagal mengambil data dari Jikan API' });
  }
});

export default router;
