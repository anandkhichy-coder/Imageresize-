import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Health checks for Cloud Run / Firebase App Hosting
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve compiled static assets from dist folder
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA Fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
