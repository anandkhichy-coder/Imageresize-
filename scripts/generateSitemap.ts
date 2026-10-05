import fs from 'fs';
import path from 'path';
import { ALL_BLOG_POSTS } from '../src/data/blogs';
import { TOOLS_LIST } from '../src/data/toolsData';

const BASE_URL = 'https://imageresize.store';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const staticUrls: SitemapUrl[] = [
  { loc: `${BASE_URL}/`, lastmod: TODAY, changefreq: 'daily', priority: '1.0' },
  { loc: `${BASE_URL}/all-tools`, lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
  { loc: `${BASE_URL}/blog`, lastmod: TODAY, changefreq: 'daily', priority: '0.9' },
  { loc: `${BASE_URL}/privacy-policy`, lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/terms-of-service`, lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/about-us`, lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/contact-us`, lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/disclaimer`, lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
];

const toolSlugMap: Record<string, string> = {
  'compressor': 'compress-image-to-50kb',
  'resizer': 'resize-image-online',
  'bg-remover': 'remove-background',
  'img-to-pdf': 'jpg-to-pdf',
  'passport': 'passport-size-photo',
  'whatsapp-dp': 'whatsapp-dp-resizer',
  'govt-form': 'govt-form-resizer',
  'converter': 'image-converter',
  'cropper': 'photo-cropper',
  'heic-to-jpg': 'heic-to-jpg',
  'bulk-compress': 'bulk-image-compressor',
};

const toolUrls: SitemapUrl[] = TOOLS_LIST.filter(t => t.id !== 'target-kb').map((tool) => {
  const slug = toolSlugMap[tool.id] || tool.id;
  return {
    loc: `${BASE_URL}/${slug}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.95',
  };
});

const blogUrls: SitemapUrl[] = ALL_BLOG_POSTS.map((post) => {
  return {
    loc: `${BASE_URL}/blog/${post.slug || post.id}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: post.featured ? '0.85' : '0.8',
  };
});

const allUrls: SitemapUrl[] = [...staticUrls, ...toolUrls, ...blogUrls];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml.trim(), 'utf-8');
console.log(`Generated sitemap.xml with ${allUrls.length} URLs at ${outputPath}`);
