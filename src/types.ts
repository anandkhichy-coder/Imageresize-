export type ToolId =
  | 'compressor'
  | 'resizer'
  | 'converter'
  | 'cropper'
  | 'bg-remover'
  | 'img-to-pdf'
  | 'passport'
  | 'whatsapp-dp'
  | 'target-kb'
  | 'govt-form'
  | 'heic-to-jpg'
  | 'bulk-compress';

export type PageView = ToolId | 'home' | 'blog-hub' | 'blog-post' | 'all-tools';

export type BlogCategory =
  | 'compress'
  | 'resize'
  | 'convert'
  | 'bg-edit'
  | 'mobile-social'
  | 'tips-info';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: BlogCategory;
  categoryLabel: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  keywords: string[];
  associatedTool: ToolId;
  toolName: string;
  badge?: string;
  featured?: boolean;
  content: {
    introduction: string;
    whyItMatters?: string;
    stepByStep: { stepNumber: number; title: string; description: string }[];
    toolScreenshotCaption: string;
    toolScreenshotType: 'compressor' | 'resizer' | 'bg-remover' | 'img-to-pdf' | 'passport' | 'whatsapp' | 'govt' | 'converter' | 'cropper' | 'heic';
    tableData?: {
      title: string;
      headers: string[];
      rows: string[][];
    };
    proTips: string[];
    commonMistakes?: string[];
    faqs: { question: string; answer: string }[];
    conclusion: string;
  };
}

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortName: string;
  badge?: string;
  category: 'resize' | 'compress' | 'convert' | 'ai' | 'specialized';
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  icon: string;
  tagline: string;
  popular?: boolean;
}

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  compressedBlob?: Blob;
  compressedSize?: number;
  compressedUrl?: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress?: number;
  errorMessage?: string;
}

export interface GovtPreset {
  id: string;
  name: string;
  organization: string;
  type: 'photo' | 'signature' | 'document';
  recommendedWidth: number;
  recommendedHeight: number;
  unit: 'px' | 'cm' | 'mm';
  minSizeKB: number;
  maxSizeKB: number;
  targetKB: number;
  dpi: number;
  format: 'jpg' | 'png' | 'pdf';
  notes: string;
}

export interface PassportPreset {
  id: string;
  country: string;
  title: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  bgColor: string;
  maxSizeKB: number;
  notes: string;
}
