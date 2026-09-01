import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  FileCheck2,
  Lock,
  Maximize2,
  Minimize2,
  RefreshCw,
  FileText,
  UserSquare2,
  MessageSquare,
  Crop,
  Smartphone,
  Layers,
  Sliders,
  Eraser
} from 'lucide-react';
import { ToolId, ToolMeta } from '../types';
import { TOOLS_LIST } from '../data/toolsData';
import { ALL_BLOG_POSTS } from '../data/blogs';

interface ToolPageWrapperProps {
  toolId: ToolId;
  children: React.ReactNode;
  onNavigateHome: () => void;
  onSelectTool: (id: ToolId) => void;
  onSelectBlogPost: (id: number) => void;
  onNavigateBlog: () => void;
  onNavigateToolsDirectory: () => void;
}

export const ToolPageWrapper: React.FC<ToolPageWrapperProps> = ({
  toolId,
  children,
  onNavigateHome,
  onSelectTool,
  onSelectBlogPost,
  onNavigateBlog,
  onNavigateToolsDirectory,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toolMeta: ToolMeta = TOOLS_LIST.find((t) => t.id === toolId) || TOOLS_LIST[0];

  // Find relevant blog posts for this tool
  const relatedPosts = ALL_BLOG_POSTS.filter(
    (post) => post.associatedTool === toolId || post.associatedTool === 'compressor'
  ).slice(0, 3);

  // Other popular tools for quick cross-navigation
  const otherTools = TOOLS_LIST.filter((t) => t.id !== toolId).slice(0, 4);

  // Tool specific instruction steps
  const getToolSteps = () => {
    switch (toolId) {
      case 'compressor':
      case 'target-kb':
        return [
          { title: 'Upload Image', desc: 'Drag and drop your JPG, PNG, or WEBP file into the upload zone.' },
          { title: 'Select Target KB', desc: 'Choose a quick preset (20KB, 50KB, 100KB) or enter your exact target file size.' },
          { title: 'Download JPG', desc: 'Our engine compresses the image to match your target KB without blurring details.' }
        ];
      case 'bg-remover':
        return [
          { title: 'Upload Photo', desc: 'Upload any portrait, product photo, selfie, or signature image.' },
          { title: 'Automatic Cutout', desc: 'Our AI detects subjects and removes backgrounds in seconds.' },
          { title: 'Choose Background', desc: 'Export as transparent PNG or add clean white/color background for official forms.' }
        ];
      case 'img-to-pdf':
        return [
          { title: 'Select Images', desc: 'Upload single or multiple JPG/PNG photos in desired page order.' },
          { title: 'Configure Layout', desc: 'Select page size (A4, Letter), orientation (Portrait/Landscape), and margins.' },
          { title: 'Export PDF', desc: 'Generate a clean, high-resolution multi-page PDF ready for upload.' }
        ];
      case 'passport':
        return [
          { title: 'Upload Portrait', desc: 'Upload a well-lit photo with face looking directly forward.' },
          { title: 'Choose Country Standard', desc: 'Select India (35x45mm), US Visa (2x2"), UK, Schengen, or Canada.' },
          { title: 'Printable Sheet', desc: 'Download single photo or 4x6 inch printable sheet with 6-8 photos.' }
        ];
      case 'whatsapp-dp':
        return [
          { title: 'Upload Any Photo', desc: 'Upload rectangular vertical or horizontal photos.' },
          { title: 'Full Fit Mode', desc: 'Auto-pad with stylish blurred background or solid white frame.' },
          { title: 'Save Square Image', desc: 'Download 1080x1080 square photo ready for WhatsApp profile with zero crop.' }
        ];
      case 'govt-form':
        return [
          { title: 'Select Exam / Portal', desc: 'Choose from SSC CGL, UPSC, Aadhaar, PAN Card, IBPS, or State PSC.' },
          { title: 'Upload File', desc: 'Upload candidate photograph or signature.' },
          { title: 'Instant Compliant Export', desc: 'Auto-scaled to exact pixel dimensions, DPI, and under 50KB/20KB.' }
        ];
      default:
        return [
          { title: 'Upload Image', desc: 'Select your photo from your device or drag and drop.' },
          { title: 'Adjust Parameters', desc: 'Customize dimensions, format, crop, or compression settings.' },
          { title: 'Instant Download', desc: 'Save the optimized image directly to your device with 100% privacy.' }
        ];
    }
  };

  // Tool specific FAQ list
  const getToolFaqs = () => {
    switch (toolId) {
      case 'compressor':
      case 'target-kb':
        return [
          {
            q: 'How does the tool compress an image to exactly 50KB or 20KB?',
            a: 'We use a smart binary search algorithm that calibrates compression levels and subsampling in your browser until the exact target file size is reached without noticeable visual degradation.'
          },
          {
            q: 'Will my signature remain sharp when reduced to 20KB?',
            a: 'Yes. Our algorithm preserves edge contrast specifically for handwritten signatures, ensuring they remain legible and pass portal verification.'
          },
          {
            q: 'Is my uploaded photo secure?',
            a: '100% secure. Everything runs locally in your browser using WebAssembly. No files are ever sent to any remote server.'
          }
        ];
      case 'bg-remover':
        return [
          {
            q: 'Can I add a white background for government forms?',
            a: 'Yes! After removing the background, simply click the "White Background" option to instantly export an official photo suitable for Aadhaar, PAN, and passport forms.'
          },
          {
            q: 'Does this tool support transparent PNG downloads?',
            a: 'Yes, you can export transparent PNGs with alpha channels for graphic design, logos, and e-commerce listings.'
          }
        ];
      case 'img-to-pdf':
        return [
          {
            q: 'How many images can I combine into one PDF?',
            a: 'You can combine 20+ images at once into a single multi-page PDF document completely free.'
          },
          {
            q: 'Can I reorder the pages before creating the PDF?',
            a: 'Yes, you can drag and reorder or adjust image orientation and margins before generating the PDF.'
          }
        ];
      case 'passport':
        return [
          {
            q: 'What is the standard Indian passport photo size?',
            a: 'Indian passport photos require 35mm x 45mm (approx 413 x 531 pixels at 300 DPI) with a light white or off-white background and 70-80% face coverage.'
          },
          {
            q: 'How do I print multiple passport photos on 4x6 paper?',
            a: 'Our tool includes a 4x6 Printable Grid option that arranges 6 to 8 photos with cutting guides on standard photo paper.'
          }
        ];
      default:
        return [
          {
            q: 'Is this tool completely free to use?',
            a: 'Yes, imageresize.store is 100% free with unlimited usage and zero registration or watermarks.'
          },
          {
            q: 'Are my images stored anywhere on the internet?',
            a: 'No. All processing happens entirely in your local browser memory via HTML5 Canvas and WebAssembly.'
          }
        ];
    }
  };

  const steps = getToolSteps();
  const faqs = getToolFaqs();

  const getToolIcon = (id: ToolId) => {
    switch (id) {
      case 'compressor': return <Minimize2 className="w-4 h-4" />;
      case 'resizer': return <Maximize2 className="w-4 h-4" />;
      case 'bg-remover': return <Eraser className="w-4 h-4" />;
      case 'img-to-pdf': return <FileText className="w-4 h-4" />;
      case 'passport': return <UserSquare2 className="w-4 h-4" />;
      case 'whatsapp-dp': return <MessageSquare className="w-4 h-4" />;
      case 'govt-form': return <FileCheck2 className="w-4 h-4" />;
      case 'converter': return <RefreshCw className="w-4 h-4" />;
      case 'cropper': return <Crop className="w-4 h-4" />;
      case 'heic-to-jpg': return <Smartphone className="w-4 h-4" />;
      case 'bulk-compress': return <Layers className="w-4 h-4" />;
      case 'target-kb': return <Sliders className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pt-4">
        <button 
          onClick={onNavigateHome}
          className="hover:text-blue-600 font-medium transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button 
          onClick={onNavigateToolsDirectory}
          className="hover:text-blue-600 font-medium transition-colors"
        >
          All Tools
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">
          {toolMeta.shortName}
        </span>
      </nav>

      {/* Dedicated Tool Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{toolMeta.badge || 'Standalone Tool'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {toolMeta.name}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {toolMeta.seoDescription}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Processing
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
                <Lock className="w-3.5 h-3.5 text-blue-600" /> Zero Cloud Uploads
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={onNavigateToolsDirectory}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>View All 12 Tools</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={onNavigateBlog}
              className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>100 Guides Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tool Workspace Area */}
      <div className="bg-transparent">
        {children}
      </div>

      {/* How to Use Step-by-Step */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Quick Tutorial</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            How to Use {toolMeta.shortName} (Step-by-Step)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                {idx + 1}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs for This Tool */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Frequently Asked Questions about {toolMeta.shortName}
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Relevant Guides from 100 Blog Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs text-indigo-300 font-semibold mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Related Knowledge Base</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                Step-by-Step Guides for {toolMeta.shortName}
              </h3>
            </div>
            <button
              onClick={() => {
                onNavigateBlog();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-indigo-300 hover:text-white font-bold flex items-center space-x-1"
            >
              <span>Explore All 100 Guides →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onSelectBlogPost(post.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-indigo-300">
                    <span>Topic #{post.id}</span>
                    <span>{post.date}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-200 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-semibold">
                  <span>Read Tutorial</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Switch to Other Tools */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Explore Other High-Traffic Image Tools
          </h3>
          <button
            onClick={onNavigateToolsDirectory}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            All 12 Tools →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {otherTools.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelectTool(t.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all text-left group flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {getToolIcon(t.id)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                  {t.shortName}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {t.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
