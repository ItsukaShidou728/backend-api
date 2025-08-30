import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import axios from 'axios';

// Konversi __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi app
const app = express();
const port = 3000;

// Path utama
const routesPath = path.join(__dirname, 'route');
const publicPath = path.join(__dirname, 'public');

// Middleware bawaan
app.use(express.json()); // Untuk menangani req.body
app.use(express.static(publicPath)); // Serve public files

// Serve index.html saat akses "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Fungsi membersihkan IP address (misalnya ::ffff:127.0.0.1)
function cleanIp(ip) {
  return ip.replace('::ffff:', '');
}

// Logging menggunakan morgan (rapi dan lengkap)
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    return [
      '\n[ API NSSID ]',
      `Time     : ${tokens.date(req, res, 'iso')}`,
      `Method   : ${tokens.method(req, res)}`,
      `URL      : ${tokens.url(req, res)}`,
      `Status   : ${tokens.status(req, res)}`,
      `Length   : ${tokens.res(req, res, 'content-length') || 0} bytes`,
      `Duration : ${tokens['response-time'](req, res)} ms`,
      `Agent    : ${tokens['user-agent'](req, res)}`,
      `Body     : ${tokens.body(req, res)}`,
      '-----------------------------\n'
    ].join('\n');
  })
);

// Fungsi untuk mengirim webhook ke Discord
const sendWebhookNotification = async (req) => {
  const webhookUrl = 'https://discord.com/api/webhooks/1202986537323601940/JhEIzgsadTzxy0daq2myOnLyxkGHTGgg3GNlaiFRsoO_MaVBY0DFHYI1Eowc8RdGErqw';

  const payload = {
    embeds: [
      {
        title: 'API Request Notification',
        color: 0x3498db,
        fields: [
          { name: 'Endpoint', value: req.originalUrl, inline: false },
          { name: 'IP', value: `||${cleanIp(req.ip)}||`, inline: false },
          { name: 'Method', value: req.method, inline: true },
          { name: 'User-Agent', value: req.get('User-Agent') || 'Unknown', inline: false }
        ],
        footer: {
          text: 'API Request Logged',
          icon_url: 'https://github.com/bukannpc.png'
        },
        timestamp: new Date()
      }
    ]
  };

  try {
    await axios.post(webhookUrl, payload);
    console.log('✅ Webhook sent to Discord');
  } catch (error) {
    console.error('❌ Error sending webhook:', error?.response?.data || error.message || error);
  }
};

// Middleware untuk mengirim data ke webhook Discord
const logRequestToWebhook = (req, res, next) => {
  sendWebhookNotification(req);
  next();
};

// Pasang middleware untuk log ke Discord secara global (optional: bisa pindah ke route tertentu)
app.use(logRequestToWebhook);

// Register semua route dalam folder /route
async function registerRoutes(dir, baseRoute = '') {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await registerRoutes(fullPath, `${baseRoute}/${file}`);
    } else if (file.endsWith('.js')) {
      const routeModule = await import(`file://${fullPath}`);
      const routeHandler = routeModule.default || routeModule;
      const routeName = file.replace('.js', '');
      const fullRoute = `${baseRoute}/${routeName}`;
      app.use(`/api${fullRoute}`, routeHandler);
      console.log(`✅ Registered route: /api${fullRoute}`);
    }
  }
}

// Jalankan fungsi registerRoutes lalu nyalakan server
await registerRoutes(routesPath);

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
