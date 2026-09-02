import express from 'express';
import path from 'path';

async function startServer() {
  const app = express();
  
  // App Hosting / Cloud Run injects PORT (e.g. 8080), fallback to 3000 for local dev
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Cloud Run / Firebase App Hosting Health Check Endpoints
  app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (process.env.NODE_ENV !== 'production') {
    // Development mode with dynamic Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve compiled static files from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();


