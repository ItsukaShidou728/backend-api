import express from 'express';
import axios from 'axios';
import xml2js from 'xml2js';
const router = express.Router();

// Endpoint: /tools/gempa
router.get('/', async (req, res) => {
  try {
    // Mengambil data gempa terbaru dari BMKG (format XML)
    const { data } = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml');
    // Parsing XML ke JSON
    xml2js.parseString(data, (err, result) => {
      if (err) return res.status(500).json({ status: false, message: 'Gagal parsing data BMKG' });
      const gempa = result.Infogempa.gempa[0];
      res.json({
        status: true,
        waktu: gempa.Tanggal[0] + ' ' + gempa.Jam[0],
        lintang: gempa.Lintang[0],
        bujur: gempa.Bujur[0],
        magnitude: gempa.Magnitude[0],
        kedalaman: gempa.Kedalaman[0],
        wilayah: gempa.Wilayah[0],
        potensi: gempa.Potensi[0],
        dirasakan: gempa.Dirasakan ? gempa.Dirasakan[0] : '-',
        shakemap: 'https://data.bmkg.go.id/DataMKG/TEWS/' + gempa.Shakemap[0]
      });
    });
  } catch (e) {
    res.status(500).json({ status: false, message: 'Gagal mengambil data dari BMKG' });
  }
});

export default router;
