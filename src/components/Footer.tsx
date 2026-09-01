import React from 'react';
import { Minimize2, ShieldCheck, Heart, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { ToolId } from '../types';
import { TOOLS_LIST } from '../data/toolsData';

interface FooterProps {
  onSelectTool: (id: ToolId) => void;
  onNavigateBlog?: () => void;
  onNavigateToolsDirectory?: () => void;
  onSelectBlogPost?: (id: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectTool,
  onNavigateBlog,
  onNavigateToolsDirectory,
  onSelectBlogPost,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Minimize2 className="w-4 h-4" />
              </div>
              <span>imageresize<span className="text-blue-400">.store</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The free, ultra-fast online image processing suite. 100% client-side privacy with no cloud storage.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Uploads • RAM Only</span>
            </div>
            {onNavigateBlog && (
              <button
                onClick={() => {
                  onNavigateBlog();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore 100 Free Image Guides →</span>
              </button>
            )}
          </div>

          {/* High Traffic Tools */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectTool('compressor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Compress Image to 50KB / 100KB
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('bg-remover');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Background Remover (Free)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('img-to-pdf');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  JPG to PDF Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('passport');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Passport Photo Maker (35x45mm)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTool('whatsapp-dp');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  WhatsApp DP Resizer (No Crop)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateToolsDirectory) onNavigateToolsDirectory();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-left"
                >
                  View All 12 Tools Directory →
                </button>
              </li>
            </ul>
          </div>

          {/* Exam & Form Guides (100 Blog Posts) */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Top 100 Guides</span>
              <span className="text-[10px] bg-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono">100</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    if (onSelectBlogPost) onSelectBlogPost(1);
                    else if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  #1: How to Compress Image to 50KB
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectBlogPost) onSelectBlogPost(4);
                    else if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  #4: Aadhaar Form 50KB Photo Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectBlogPost) onSelectBlogPost(29);
                    else if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  #29: Passport 35x45mm Photo Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectBlogPost) onSelectBlogPost(49);
                    else if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  #49: Multiple Images to One PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectBlogPost) onSelectBlogPost(66);
                    else if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  #66: 1-Click White Background
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors text-left"
                >
                  Browse All 100 Tutorials →
                </button>
              </li>
            </ul>
          </div>

          {/* SEO Keywords Cloud */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Top Search Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {[
                'compress image to 50kb',
                'reduce photo to 20kb',
                'remove background online free',
                'jpg to pdf converter',
                'passport size photo online',
                'whatsapp dp size without crop',
                'photo resize for government form',
                'heic to jpg',
                'bulk photo compress',
                '35x45mm photo maker',
              ].map((k) => (
                <span
                  key={k}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded cursor-pointer transition-colors"
                  onClick={() => {
                    if (onNavigateBlog) onNavigateBlog();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 imageresize.store — All Rights Reserved. Built for Speed, Privacy & Precision.</p>
          <p className="flex items-center gap-1">
            Free Web Utility <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
