import React, { useState } from 'react';
import { 
  ChevronDown, 
  CheckCircle2, 
  Zap, 
  Lock, 
  Cpu, 
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { SEO_FAQS } from '../data/toolsData';
import { ALL_BLOG_POSTS } from '../data/blogs';
import { ToolId } from '../types';

interface SeoContentSectionProps {
  onNavigateBlog?: () => void;
  onSelectBlogPost?: (id: number) => void;
  onSelectTool?: (id: ToolId) => void;
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  onNavigateBlog,
  onSelectBlogPost,
  onSelectTool,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Top spotlight articles for the home page SEO grid
  const featuredArticles = ALL_BLOG_POSTS.filter(p => [1, 4, 26, 29, 49, 66, 81, 95].includes(p.id));

  return (
    <div className="mt-16 space-y-16 border-t border-slate-200/80 pt-12">
      
      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-start">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Target 50KB / 20KB Exact Compression
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Engineered specifically for government exam portals (SSC, UPSC, State PSC, Bank PO) where files must strictly stay under 50KB or 20KB without blurring text or signatures.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-start">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            100% Client-Side Privacy
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            All photo compression, resizing, background removal, and PDF conversions happen right in your browser via WebAssembly and HTML5 Canvas. No file is ever sent to an external server.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-start">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            High Quality HD Image Processing
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Intelligent bicubic resampling algorithms safeguard facial features, passport proportions, DPI print standards (300 DPI), and clean signature strokes.
          </p>
        </div>
      </div>

      {/* Featured 100 Blog Posts Teaser Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Comprehensive Knowledge Base</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              100 SEO & Step-by-Step Image Editing Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Explore 100 comprehensive, human-friendly tutorials covering target KB compression, government exam portal rules, WhatsApp DP dimensions, and passport photo standards.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateBlog) onNavigateBlog();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-lg flex items-center justify-center space-x-2 shrink-0 transition-transform transform hover:scale-105 active:scale-100"
          >
            <span>Browse All 100 Guides</span>
            <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>
        </div>

        {/* 8 Featured Articles Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {featuredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => {
                if (onSelectBlogPost) onSelectBlogPost(article.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-bold">Topic #{article.id}</span>
                  <span className="text-slate-400">{article.readTime}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-200 line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-semibold">
                <span>{article.toolName}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Article 1: How to compress image to 50kb online */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">
          How to Compress an Image to 50KB Online Free (Step-by-Step)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
          Many government exam portals, bank job application forms, and university admissions require candidates to upload passport photographs and signatures strictly between <strong>20KB to 50KB</strong>. Standard image compressors often degrade the quality too much or fail to meet the exact file size threshold. Here is how imageresize.store solves this effortlessly:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Step 1</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2 mb-1">Upload Your Photo</h4>
            <p className="text-xs text-slate-500">Drag and drop your JPG, PNG or iPhone HEIC file into the compression box.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Step 2</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2 mb-1">Click the &ldquo;50 KB&rdquo; Preset</h4>
            <p className="text-xs text-slate-500">Our binary search engine iteratively calibrates quality to match under 50KB.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Step 3</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2 mb-1">Download Instant Clean JPG</h4>
            <p className="text-xs text-slate-500">Your optimized photo is ready to upload to any recruitment website.</p>
          </div>
        </div>
      </div>

      {/* Structured FAQs Section with SEO Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Frequently Asked Questions (FAQs)
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {SEO_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
