import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Fetch manga by ID
router.get('/', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id parameter' });

  try {
    const url = `https://api.mangadex.org/manga/${id}?includes[]=artist&includes[]=author&includes[]=cover_art`;
    const response = await fetch(url);
    const json = await response.json();

    if (!json.data) return res.status(404).json({ error: 'Manga not found' });

    const manga = json.data;
    const title = manga.attributes.title.en || '[no title]';
    const description = manga.attributes.description.en || '[no description]';
    const status = manga.attributes.status;
    const year = manga.attributes.year;

    const artist = manga.relationships.find(r => r.type === 'artist')?.attributes?.name;
    const author = manga.relationships.find(r => r.type === 'author')?.attributes?.name;
    const cover = manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName;
    const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${cover}`;

    res.json({
      id: manga.id,
      title,
      description,
      status,
      year,
      artist,
      author,
      coverUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Search manga by query
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=10&includes[]=cover_art`;
    const response = await fetch(url);
    const json = await response.json();

    if (!json.data || json.data.length === 0) return res.status(404).json({ error: 'No manga found' });

    const results = json.data.map(manga => {
      const title = manga.attributes.title.en || '[no title]';
      const status = manga.attributes.status;
      const year = manga.attributes.year;
      const id = manga.id;
      const cover = manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName;
      const coverUrl = cover ? `https://uploads.mangadex.org/covers/${id}/${cover}` : null;

      return { id, title, status, year, coverUrl };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
