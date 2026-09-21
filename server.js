import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Health check endpoints for Cloud Run / Firebase App Hosting
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resolve dist path reliably
const distPath = path.resolve(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Graceful fallback if dist is building or not yet compiled
  app.get('*', (req, res) => {
    res.status(200).send('<!DOCTYPE html><html><body><h3>App server is running on Cloud Run!</h3><p>Building assets...</p></body></html>');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server successfully listening on 0.0.0.0:${PORT}`);
});

