import express from 'express';
import axios from 'axios';

const router = express.Router();
const defaultResolution = '360'; // Default ke 360p

// Fungsi untuk mengambil URL unduhan video
const downloadVideo = async (url, resolution) => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${resolution}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

    try {
        const response = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (response.data && response.data.success) {
            const { id, title, info } = response.data;
            const { image } = info;
            const downloadUrl = await checkProgress(id);

            return { title, thumbnail: image, downloadUrl };
        } else {
            throw new Error('Gagal mengambil detail video.');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Fungsi untuk mengecek progres unduhan
const checkProgress = async (id) => {
    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;

    try {
        while (true) {
            const response = await axios.get(progressUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            if (response.data && response.data.success && response.data.progress === 1000) {
                return response.data.download_url;
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu 5 detik sebelum cek ulang
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Endpoint untuk mengunduh video YouTube (MP4)
router.get('/', async (req, res) => {
    const { url, resolution } = req.query;
    const videoResolution = resolution || defaultResolution; // Gunakan resolusi default jika tidak ditentukan

    if (!url) {
        return res.status(400).json({ error: 'URL YouTube diperlukan!' });
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return res.status(400).json({ error: 'URL tidak valid!' });
    }

    try {
        const { title, thumbnail, downloadUrl } = await downloadVideo(url, videoResolution);

        res.json({
            message: 'Data berhasil diambil',
            data: { title, resolution: videoResolution + 'p', thumbnail, downloadUrl }
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data YouTube', details: error.message });
    }
});

export default router;
