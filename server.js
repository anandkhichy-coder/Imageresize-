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
let cachedIndexHtml = '';

function getBaseIndexHtml() {
  if (!cachedIndexHtml) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      cachedIndexHtml = fs.readFileSync(indexPath, 'utf-8');
    }
  }
  return cachedIndexHtml;
}

// SEO Route Metadata dictionary (India-Focused 2026 Target Keywords)
const ROUTE_META = {
  '/': {
    title: 'Free Image Compressor to 50KB | Resize, Background Remover, JPG to PDF | imageresize.store',
    desc: 'Free online image tools: Compress image to 50KB/20KB without losing quality, remove background free, resize photos to passport size 35x45mm, and convert JPG to PDF online. No watermark, 100% private.',
  },
  '/all-tools': {
    title: 'All Free Online Image Tools Directory | imageresize.store',
    desc: 'Browse all 11 free in-browser image tools: 50KB Compressor, AI Background Remover, JPG to PDF, Passport Photo Maker, HEIC to JPG, and Bulk Compressor.',
  },
  '/blog': {
    title: '100 Free Image Editing Guides & Exam Form Masterclasses | imageresize.store',
    desc: 'Explore 100 step-by-step tutorials for image compression to 50KB, Aadhaar resizing, WhatsApp DP without crop, passport photos, and background removal.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy & Cookie Compliance (Google AdSense) | imageresize.store',
    desc: 'Read the privacy policy of imageresize.store. Zero server uploads, browser memory processing, Google AdSense cookie disclosure, and GDPR/CCPA compliance.',
  },
  '/terms-of-service': {
    title: 'Terms of Service & User Agreement | imageresize.store',
    desc: 'Terms of service and permitted usage guidelines for imageresize.store free client-side image processing tools.',
  },
  '/about-us': {
    title: 'About Us — 100% Client-Side Privacy Tool Mission | imageresize.store',
    desc: 'Learn about the mission, engineering team, and client-side WebAssembly architecture behind imageresize.store.',
  },
  '/contact-us': {
    title: 'Contact Us & Technical Support | imageresize.store',
    desc: 'Get in touch with the imageresize.store engineering team for tool inquiries, feedback, or support.',
  },
  '/disclaimer': {
    title: 'Disclaimer & Government Form Guidelines | imageresize.store',
    desc: 'Official disclaimer regarding government exam presets (UPSC, SSC, Aadhaar) and third-party trademarks.',
  },
  // Direct High-Volume Tool Slugs
  '/compress-image-to-50kb': {
    title: 'Compress Image to 50KB, 20KB, 100KB Online Free — Fast & No Watermark | imageresize.store',
    desc: 'Compress image to 50KB, 20KB, 100KB, or 10KB online free without losing quality. Perfect for SSC, UPSC, NEET, Aadhaar, PAN card, and job application forms. Instant download.',
  },
  '/resize-image-online': {
    title: 'Resize Image Online Free — Photo Resizer in Pixels, CM, Inches & KB | imageresize.store',
    desc: 'Resize image online free in pixels (300x300, 413x531), centimeters, inches, or KB (50KB, 200KB). Aspect ratio lock, passport size crop, and instant high-res download.',
  },
  '/remove-background': {
    title: 'Remove Background Online Free — Instant White & Transparent BG (No Watermark) | imageresize.store',
    desc: '100% Free background remover online with AI. Remove photo background instantly, change background to white for passport, visa, and Aadhaar, or download transparent PNG.',
  },
  '/passport-size-photo': {
    title: 'Passport Size Photo Maker Online Free — 35x45mm & 2x2 Inch with White Background | imageresize.store',
    desc: 'Free passport size photo maker online for India, NEET 2026, UPSC, SSC, PAN card, Aadhaar, US Visa, and Schengen. 35x45mm, 2x2 inch, printable 4x6 sheets, and white background.',
  },
  '/jpg-to-pdf': {
    title: 'JPG to PDF Converter Online Free — Convert Image to PDF Under 100KB/200KB | imageresize.store',
    desc: 'Convert JPG, PNG, WEBP images to PDF document online for free. Combine multiple photos into a single PDF with custom page size and compress PDF to under 100KB/200KB.',
  },
  '/heic-to-jpg': {
    title: 'HEIC to JPG Converter Online Free — Convert iPhone Photos to JPG (No Download) | imageresize.store',
    desc: 'Convert Apple iPhone HEIC and HEIF photos to JPG or PNG format online for free. Fast batch conversion directly in your browser with zero upload privacy and high quality.',
  },
  '/whatsapp-dp-resizer': {
    title: 'WhatsApp DP Resizer — Full DP Without Crop Online (Square Fit & Blur BG) | imageresize.store',
    desc: 'Resize photo for WhatsApp DP without crop online. Full profile picture maker with blurred background, circular preview guide, and square fit for WhatsApp and Instagram.',
  },
  '/govt-form-resizer': {
    title: 'Govt Form Photo & Signature Resizer — NEET 2026, SSC, UPSC, Aadhaar, PAN | imageresize.store',
    desc: 'Resize photo and signature for Indian government exams & portal applications. Instant presets for NEET 2026, SSC CGL/CHSL, UPSC, Aadhaar, PAN Card, and Railway NTPC.',
  },
  '/image-converter': {
    title: 'JPG PNG WEBP Converter Online — Convert Image Format Free | imageresize.store',
    desc: 'Free online image format converter. Convert JPG to PNG, PNG to JPG, WEBP to JPG, AVIF to PNG with batch processing and high quality.',
  },
  '/photo-cropper': {
    title: 'Photo Crop & Resize Tool — Crop Images Online to Any Ratio | imageresize.store',
    desc: 'Crop JPG, PNG, WEBP photos online with custom aspect ratios (1:1, 16:9, 4:3, 9:16, 4:5). Rotate, flip, zoom and download in high resolution.',
  },
  '/bulk-image-compressor': {
    title: 'Bulk Image Compressor — Compress Multiple Images Online Free | imageresize.store',
    desc: 'Compress multiple JPG, PNG, and WEBP images at once online. Batch compress up to 50 photos to target KB and download as a ZIP file.',
  },
};

// Also map /tools/... routes for backwards compatibility
Object.keys(ROUTE_META).forEach((key) => {
  if (key.startsWith('/') && key !== '/' && !key.startsWith('/tools/')) {
    ROUTE_META[`/tools${key}`] = ROUTE_META[key];
  }
});
ROUTE_META['/tools/photo-resizer'] = ROUTE_META['/resize-image-online'];
ROUTE_META['/tools/background-remover'] = ROUTE_META['/remove-background'];
ROUTE_META['/tools/passport-photo-maker'] = ROUTE_META['/passport-size-photo'];

if (fs.existsSync(distPath)) {
  // Serve static assets first (css, js, images, robots.txt, sitemap.xml, ads.txt)
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    const rawHtml = getBaseIndexHtml();
    if (!rawHtml) {
      return res.status(200).send('<!DOCTYPE html><html><body><h3>Loading...</h3></body></html>');
    }

    const cleanPath = req.path.replace(/\/+$/, '') || '/';
    const canonicalUrl = `https://imageresize.store${cleanPath === '/' ? '/' : cleanPath}`;
    
    // Look up meta for known route or fallback
    const meta = ROUTE_META[cleanPath] || {
      title: 'Free Image Compressor to 50KB | Resize, Background Remover, JPG to PDF | imageresize.store',
      desc: 'Free online image tools: Compress image to 50KB/20KB without losing quality, remove background free, resize photos to passport size 35x45mm, and convert JPG to PDF online. No watermark, 100% private.',
    };

    // Inject exact canonical, title, and descriptions dynamically for search engines
    let customHtml = rawHtml
      .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`)
      .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${meta.desc}"`)
      .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${meta.title}"`)
      .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${meta.desc}"`)
      .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`)
      .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${meta.title}"`)
      .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${meta.desc}"`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(customHtml);
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
