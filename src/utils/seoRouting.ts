import { PageView, ToolId, BlogPost } from '../types';
import { TOOLS_LIST } from '../data/toolsData';
import { ALL_BLOG_POSTS, getBlogPostById } from '../data/blogs';

export const BASE_SITE_URL = 'https://imageresize.store';

// Canonical tool slug dictionary (Optimized with 2026 Top Keywords)
export const TOOL_SLUG_MAP: Record<ToolId, string> = {
  'compressor': 'compress-image-to-50kb',
  'target-kb': 'compress-image-to-50kb',
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

// Aliases and slug mappings for flexible deep linking
const SLUG_TO_TOOL_ID: Record<string, ToolId> = {
  // Primary slugs
  'compress-image-to-50kb': 'compressor',
  'resize-image-online': 'resizer',
  'remove-background': 'bg-remover',
  'passport-size-photo': 'passport',
  'jpg-to-pdf': 'img-to-pdf',
  'heic-to-jpg': 'heic-to-jpg',
  'whatsapp-dp-resizer': 'whatsapp-dp',
  'govt-form-resizer': 'govt-form',
  'image-converter': 'converter',
  'photo-cropper': 'cropper',
  'bulk-image-compressor': 'bulk-compress',

  // Secondary & legacy alias slugs
  'photo-resizer': 'resizer',
  'background-remover': 'bg-remover',
  'passport-photo-maker': 'passport',
  'heic-to-jpg-converter': 'heic-to-jpg',
  'whatsapp-dp': 'whatsapp-dp',
  'govt-forms': 'govt-form',
  'bulk-compress': 'bulk-compress',
  'compressor': 'compressor',
  'resizer': 'resizer',
  'bg-remover': 'bg-remover',
  'img-to-pdf': 'img-to-pdf',
  'passport': 'passport',
  'converter': 'converter',
  'cropper': 'cropper',
};

export interface RouteState {
  currentView: PageView;
  activeTool?: ToolId;
  selectedBlogPostId?: number;
}

/**
 * Parses window.location.pathname and returns the corresponding RouteState
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { currentView: 'home', activeTool: 'compressor', selectedBlogPostId: 1 };
  }

  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  // 1. Static Legal Pages
  if (path === '/privacy-policy') return { currentView: 'privacy-policy' };
  if (path === '/terms-of-service') return { currentView: 'terms-of-service' };
  if (path === '/about-us') return { currentView: 'about-us' };
  if (path === '/contact-us') return { currentView: 'contact-us' };
  if (path === '/disclaimer') return { currentView: 'disclaimer' };

  // 2. Directory & Hubs
  if (path === '/all-tools' || path === '/tools') return { currentView: 'all-tools' };
  if (path === '/blog' || path === '/guides') return { currentView: 'blog-hub' };

  // 3. Blog Post: /blog/:slugOrId or /guide/:slugOrId
  const blogMatch = path.match(/^\/(?:blog|guide)\/([^/]+)$/);
  if (blogMatch) {
    const param = blogMatch[1];
    const numericId = parseInt(param, 10);
    let post: BlogPost | undefined;

    if (!isNaN(numericId)) {
      post = getBlogPostById(numericId);
    } else {
      post = ALL_BLOG_POSTS.find((p) => p.slug === param);
    }

    if (post) {
      return { currentView: 'blog-post', selectedBlogPostId: post.id };
    }
  }

  // 4. Tools: /:toolSlug or /tools/:toolSlug
  const cleanSlug = path.replace(/^\/tools\//, '').replace(/^\//, '');
  if (cleanSlug && SLUG_TO_TOOL_ID[cleanSlug]) {
    const toolId = SLUG_TO_TOOL_ID[cleanSlug];
    return { currentView: toolId, activeTool: toolId };
  }

  // Fallback to Home
  return { currentView: 'home', activeTool: 'compressor', selectedBlogPostId: 1 };
}

/**
 * Returns canonical relative path for a state
 */
export function getRoutePath(
  view: PageView,
  activeTool?: ToolId,
  selectedBlogPostId?: number
): string {
  if (view === 'home') return '/';
  if (view === 'all-tools') return '/all-tools';
  if (view === 'blog-hub') return '/blog';
  if (view === 'privacy-policy') return '/privacy-policy';
  if (view === 'terms-of-service') return '/terms-of-service';
  if (view === 'about-us') return '/about-us';
  if (view === 'contact-us') return '/contact-us';
  if (view === 'disclaimer') return '/disclaimer';

  if (view === 'blog-post' && selectedBlogPostId) {
    const post = getBlogPostById(selectedBlogPostId);
    if (post && post.slug) {
      return `/blog/${post.slug}`;
    }
    return `/blog/${selectedBlogPostId}`;
  }

  // Standalone Tool - Clean high-volume SEO URL
  const toolId = (view in TOOL_SLUG_MAP ? view : activeTool) as ToolId;
  if (toolId && TOOL_SLUG_MAP[toolId]) {
    return `/${TOOL_SLUG_MAP[toolId]}`;
  }

  return '/';
}

/**
 * Updates browser history pushState cleanly
 */
export function syncBrowserUrl(
  view: PageView,
  activeTool?: ToolId,
  selectedBlogPostId?: number,
  replace: boolean = false
) {
  if (typeof window === 'undefined') return;

  const targetPath = getRoutePath(view, activeTool, selectedBlogPostId);
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

  if (currentPath !== targetPath) {
    const state = { view, activeTool, selectedBlogPostId };
    if (replace) {
      window.history.replaceState(state, '', targetPath);
    } else {
      window.history.pushState(state, '', targetPath);
    }
  }
}

/**
 * Injects or updates the canonical link tag in <head>
 */
export function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;

  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', url);
}

/**
 * Injects or updates OpenGraph & Twitter tags
 */
export function setSocialMetaTags(title: string, description: string, url: string) {
  if (typeof document === 'undefined') return;

  const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[property="og:title"]', 'property', 'og:title', title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', url);

  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
}

/**
 * Injects or updates dynamic JSON-LD structured data for Google rich snippets
 */
export function setJsonLdSchema(schemaObj: Record<string, unknown>) {
  if (typeof document === 'undefined') return;

  let script = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamic-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(schemaObj, null, 2);
}

/**
 * Master SEO updater function called on every view/route change
 */
export function updatePageSeo(
  view: PageView,
  activeTool: ToolId,
  selectedBlogPostId: number
) {
  if (typeof document === 'undefined') return;

  const targetPath = getRoutePath(view, activeTool, selectedBlogPostId);
  const canonicalUrl = `${BASE_SITE_URL}${targetPath}`;

  setCanonicalUrl(canonicalUrl);

  if (view === 'home') {
    // Top 3 Keywords Strategy: Free Image Compressor to 50KB | Resize, Background Remover, JPG to PDF
    const title = 'Free Image Compressor to 50KB | Resize, Background Remover, JPG to PDF | imageresize.store';
    const description = 'Free online image tools: Compress image to 50KB/20KB without losing quality, remove background free, resize photos to passport size 35x45mm, and convert JPG to PDF online. No watermark, 100% private.';
    
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);

    setJsonLdSchema({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          'name': 'imageresize.store',
          'url': canonicalUrl,
          'applicationCategory': 'MultimediaApplication',
          'operatingSystem': 'All',
          'description': description,
          'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
          'featureList': TOOLS_LIST.map((t) => t.name),
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How to compress image to 50KB online free without losing quality?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Drag and drop your JPG or PNG image on imageresize.store, select the 50KB target preset, and click Download. The iterative canvas compression retains high clarity and sharp facial details for UPSC, SSC, and NEET 2026 application forms.',
              },
            },
            {
              '@type': 'Question',
              'name': 'How to remove photo background and make it white online?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Use our AI Background Remover tool. Upload your picture and click the White Background option for official passport, visa, and Aadhaar requirements. Free, instant, and no watermark.',
              },
            },
            {
              '@type': 'Question',
              'name': 'How to resize photo to 35x45mm passport size with printable sheet?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Select Passport Photo Maker, choose Indian Passport (35x45mm) or US Visa (2x2 inch), align your face, and download individual photos or a printable 4x6 inch studio sheet with 6 to 8 photos.',
              },
            },
            {
              '@type': 'Question',
              'name': 'Photo ka size 50kb se kam kaise kare (Hindi)?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'imageresize.store par photo upload karein, "Target 50KB" select karein aur turant "Download Compressed JPG" par click karein. Photo ki quality kharab nahi hogi.',
              },
            }
          ]
        }
      ]
    });
  } else if (view === 'all-tools') {
    const title = 'All Free Online Image Tools Directory | imageresize.store';
    const description = 'Browse all 11 free in-browser image tools: 50KB Compressor, AI Background Remover, JPG to PDF, Passport Photo Maker, HEIC to JPG, and Bulk Compressor.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);

    setJsonLdSchema({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': title,
      'url': canonicalUrl,
      'description': description,
    });
  } else if (view === 'blog-hub') {
    const title = '100 Free Image Editing Guides & Exam Form Masterclasses | imageresize.store';
    const description = 'Explore 100 step-by-step tutorials for image compression to 50KB, Aadhaar resizing, WhatsApp DP without crop, passport photos, and background removal.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);

    setJsonLdSchema({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'imageresize.store Image Processing Guides',
      'url': canonicalUrl,
      'description': description,
    });
  } else if (view === 'blog-post') {
    const post = getBlogPostById(selectedBlogPostId) || ALL_BLOG_POSTS[0];
    const title = `${post.title} | imageresize.store`;
    const description = post.excerpt;

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);

    setJsonLdSchema({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': post.title,
      'description': post.excerpt,
      'url': canonicalUrl,
      'datePublished': post.date,
      'dateModified': new Date().toISOString().split('T')[0],
      'author': {
        '@type': 'Organization',
        'name': 'imageresize.store Editorial Team',
        'url': BASE_SITE_URL,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'imageresize.store',
        'url': BASE_SITE_URL,
      },
    });
  } else if (view === 'privacy-policy') {
    const title = 'Privacy Policy & Cookie Disclosure | imageresize.store';
    const description = 'Read the privacy policy of imageresize.store. 100% zero server uploads, browser RAM processing, Google AdSense cookie disclosure, and GDPR/CCPA compliance.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);
  } else if (view === 'terms-of-service') {
    const title = 'Terms of Service & Conditions of Use | imageresize.store';
    const description = 'Terms of service and permitted usage guidelines for imageresize.store free client-side image processing utilities.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);
  } else if (view === 'about-us') {
    const title = 'About Us — Zero-Upload Client Privacy Mission | imageresize.store';
    const description = 'Learn about our mission, engineering philosophy, and zero-upload WebAssembly architecture behind imageresize.store.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);
  } else if (view === 'contact-us') {
    const title = 'Contact Us & Technical Support | imageresize.store';
    const description = 'Get in touch with the imageresize.store team for tool suggestions, bug reports, or support.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);
  } else if (view === 'disclaimer') {
    const title = 'Disclaimer & Government Form Specifications | imageresize.store';
    const description = 'Important disclaimer regarding government recruitment presets (SSC, UPSC, Aadhaar) and third-party trademarks.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);
  } else {
    // Dedicated Tool View
    const tool = TOOLS_LIST.find((t) => t.id === view || t.id === activeTool) || TOOLS_LIST[0];
    const title = `${tool.seoTitle} | imageresize.store`;
    const description = tool.seoDescription;

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    setSocialMetaTags(title, description, canonicalUrl);

    setJsonLdSchema({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': tool.name,
      'url': canonicalUrl,
      'applicationCategory': 'MultimediaApplication',
      'operatingSystem': 'All',
      'description': tool.seoDescription,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    });
  }
}
