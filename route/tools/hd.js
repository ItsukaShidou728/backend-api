import express from 'express'
import FormData from 'form-data'
import https from 'https'
import axios from 'axios'

const router = express.Router()

router.get('/', async (req, res) => {
  const imageUrl = req.query.url

  if (!imageUrl) {
    return res.status(400).json({ error: 'URL gambarnya mana kak? Contoh: ?url=https://...' })
  }

  try {
    // Download image as buffer
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })

    const mime = response.headers['content-type'] || ''
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return res.status(400).json({ error: `Mime ${mime} tidak support` })
    }

    const resultBuffer = await processing(response.data, 'enhance')
    res.setHeader('Content-Type', 'image/jpeg')
    return res.send(resultBuffer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Gagal memproses gambar :(' })
  }
})

async function processing(imageBuffer, method) {
  return new Promise((resolve, reject) => {
    let Methods = ['enhance']
    if (!Methods.includes(method)) method = Methods[0]

    const form = new FormData()
    form.append('model_version', 1)
    form.append('image', imageBuffer, {
      filename: 'enhance_image_body.jpg',
      contentType: 'image/jpeg',
    })

    const options = {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'okhttp/4.9.3',
        Connection: 'Keep-Alive',
        'Accept-Encoding': 'gzip',
      },
    }

    const req = https.request(`https://inferenceengine.vyro.ai/${method}`, options, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })

    req.on('error', reject)
    form.pipe(req)
  })
}

export default router
