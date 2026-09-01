import { BlogPost, BlogCategory } from '../../types';
import { COMPRESS_BLOGS } from './compressBlogs';
import { RESIZE_BLOGS } from './resizeBlogs';
import { CONVERT_BLOGS } from './convertBlogs';
import { BG_EDIT_BLOGS } from './bgEditBlogs';
import { MOBILE_SOCIAL_BLOGS } from './mobileSocialBlogs';
import { TIPS_INFO_BLOGS } from './tipsInfoBlogs';

// Progressive date generator: Post #1 = 100 days ago, Post #100 = Today
function getProgressiveDate(postId: number): string {
  const now = new Date();
  const daysAgo = Math.max(0, 100 - postId);
  const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const RAW_BLOG_POSTS: BlogPost[] = [
  ...COMPRESS_BLOGS,
  ...RESIZE_BLOGS,
  ...CONVERT_BLOGS,
  ...BG_EDIT_BLOGS,
  ...MOBILE_SOCIAL_BLOGS,
  ...TIPS_INFO_BLOGS,
];

// Enrich all 100 blog posts with sequential progressive dates (100 days ago -> Today)
export const ALL_BLOG_POSTS: BlogPost[] = RAW_BLOG_POSTS.map(post => ({
  ...post,
  date: getProgressiveDate(post.id),
}));

export const BLOG_CATEGORIES: { id: BlogCategory | 'all'; label: string; count: number; icon: string; description: string }[] = [
  {
    id: 'all',
    label: 'All 100 Guides',
    count: ALL_BLOG_POSTS.length,
    icon: 'BookOpen',
    description: 'Browse our complete catalog of 100 SEO & human-friendly image editing tutorials.'
  },
  {
    id: 'compress',
    label: 'Compress Image (25)',
    count: COMPRESS_BLOGS.length,
    icon: 'Minimize2',
    description: 'Compress photos to 50KB, 20KB, 100KB for government forms, WhatsApp, and emails.'
  },
  {
    id: 'resize',
    label: 'Resize Image (20)',
    count: RESIZE_BLOGS.length,
    icon: 'Maximize2',
    description: 'Resize image dimensions in pixels, cm, mm, and inches with aspect ratio lock.'
  },
  {
    id: 'convert',
    label: 'Convert Image (20)',
    count: CONVERT_BLOGS.length,
    icon: 'RefreshCw',
    description: 'Convert between JPG, PNG, WebP, HEIC to JPG, and combine images into single PDF.'
  },
  {
    id: 'bg-edit',
    label: 'Background & Edit (15)',
    count: BG_EDIT_BLOGS.length,
    icon: 'Eraser',
    description: '1-click AI background removal, white passport backgrounds, and transparent logos.'
  },
  {
    id: 'mobile-social',
    label: 'Mobile & Social (10)',
    count: MOBILE_SOCIAL_BLOGS.length,
    icon: 'Smartphone',
    description: 'WhatsApp DP without crop, Instagram 9:16 stories, and YouTube banner sizes.'
  },
  {
    id: 'tips-info',
    label: 'Informational & Tips (10)',
    count: TIPS_INFO_BLOGS.length,
    icon: 'Sparkles',
    description: 'Masterclasses on DPI, lossy vs lossless compression, and website Core Web Vitals.'
  }
];

export function getBlogPostById(id: number): BlogPost | undefined {
  return ALL_BLOG_POSTS.find(post => post.id === id);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return ALL_BLOG_POSTS.find(post => post.slug === slug);
}

export function getRelatedPosts(currentId: number, category: BlogCategory, limit = 3): BlogPost[] {
  return ALL_BLOG_POSTS
    .filter(post => post.id !== currentId && (post.category === category || post.featured))
    .slice(0, limit);
}

export function searchBlogPosts(query: string, categoryFilter: BlogCategory | 'all' = 'all'): BlogPost[] {
  const cleanQuery = query.toLowerCase().trim();
  
  return ALL_BLOG_POSTS.filter(post => {
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    if (!matchesCategory) return false;
    
    if (!cleanQuery) return true;
    
    const matchesTitle = post.title.toLowerCase().includes(cleanQuery);
    const matchesExcerpt = post.excerpt.toLowerCase().includes(cleanQuery);
    const matchesKeywords = post.keywords.some(k => k.toLowerCase().includes(cleanQuery));
    const matchesTool = post.toolName.toLowerCase().includes(cleanQuery);
    const matchesIntro = post.content.introduction.toLowerCase().includes(cleanQuery);
    
    return matchesTitle || matchesExcerpt || matchesKeywords || matchesTool || matchesIntro;
  });
}
