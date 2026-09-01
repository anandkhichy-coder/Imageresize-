import React, { useEffect, useState } from 'react';
import { BlogPost, ToolId } from '../types';
import { getRelatedPosts } from '../data/blogs';
import { BlogMockupScreenshot } from './BlogMockupScreenshot';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Check, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight,
  BookOpen,
  Tag
} from 'lucide-react';

interface BlogPostViewProps {
  post: BlogPost;
  onBackToBlog: () => void;
  onSelectPost: (id: number) => void;
  onLaunchTool: (toolId: ToolId) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBackToBlog,
  onSelectPost,
  onLaunchTool,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const relatedPosts = getRelatedPosts(post.id, post.category, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBackToBlog}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All 100 Guides</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {post.categoryLabel}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="Copy Guide Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Guide</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Article Header */}
        <header className="space-y-4 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            {post.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                ⭐ {post.badge}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
              Topic #{post.id} of 100
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
            <div className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Quick Launch Banner */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Direct Tool Access</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg">Need to use this tool right now?</h3>
            <p className="text-xs text-blue-100">Launch the official {post.toolName} online on imageresize.store — 100% free.</p>
          </div>
          <button
            onClick={() => onLaunchTool(post.associatedTool)}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 transform hover:scale-105 active:scale-100"
          >
            <span>Launch {post.toolName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Article Body */}
        <div className="mt-8 space-y-8 text-slate-800 text-base leading-relaxed">
          {/* Introduction Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              <span>Overview & Key Requirements</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-base">
              {post.content.introduction}
            </p>
            {post.content.whyItMatters && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 text-sm">
                <span className="font-bold text-blue-900 block mb-1">Why this is critical:</span>
                {post.content.whyItMatters}
              </div>
            )}
          </section>

          {/* Dedicated Visual Tool Screenshot & Live Preview */}
          <section>
            <BlogMockupScreenshot
              toolType={post.content.toolScreenshotType}
              associatedTool={post.associatedTool}
              toolName={post.toolName}
              caption={post.content.toolScreenshotCaption}
              onLaunchTool={onLaunchTool}
            />
          </section>

          {/* Step by Step Guide */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              <span>Step-by-Step Tutorial</span>
            </h2>

            <div className="space-y-3 mt-4">
              {post.content.stepByStep.map((step) => (
                <div 
                  key={step.stepNumber}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-blue-500/30">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Specification Table (If provided) */}
          {post.content.tableData && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-6 bg-emerald-600 rounded-full inline-block"></span>
                <span>{post.content.tableData.title}</span>
              </h2>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      {post.content.tableData.headers.map((header, idx) => (
                        <th key={idx} className="p-3 sm:p-4">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {post.content.tableData.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className={`p-3 sm:p-4 ${cellIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Pro Tips & Best Practices */}
          {post.content.proTips && post.content.proTips.length > 0 && (
            <section className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span>Expert Pro Tips for Best Results</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 list-disc list-inside">
                {post.content.proTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Common Mistakes to Avoid */}
          {post.content.commonMistakes && post.content.commonMistakes.length > 0 && (
            <section className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
              <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Common Mistakes to Avoid</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-rose-900 list-disc list-inside">
                {post.content.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {mistake}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Frequently Asked Questions Accordion */}
          {post.content.faqs && post.content.faqs.length > 0 && (
            <section className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>Frequently Asked Questions (FAQs)</span>
              </h2>

              <div className="space-y-3">
                {post.content.faqs.map((faq, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setActiveAccordion(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-semibold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50"
                      >
                        <span>{faq.question}</span>
                        <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-90 text-blue-600' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Conclusion */}
          <section className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Summary & Takeaways</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {post.content.conclusion}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onLaunchTool(post.associatedTool)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <span>Try {post.toolName} Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* Prev / Next Article Bar */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200">
            {post.id > 1 ? (
              <button
                onClick={() => onSelectPost(post.id - 1)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group flex items-center space-x-3 bg-white"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Previous Guide #{post.id - 1}</div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">Guide #{post.id - 1}</div>
                </div>
              </button>
            ) : <div />}

            {post.id < 100 ? (
              <button
                onClick={() => onSelectPost(post.id + 1)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-right transition-all group flex items-center justify-end space-x-3 bg-white"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Next Guide #{post.id + 1}</div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">Guide #{post.id + 1}</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ) : <div />}
          </div>

          {/* SEO Keywords Tags Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-200">
            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="text-xs text-slate-500 font-medium mr-1">Trending Tags:</span>
            {post.keywords.map((kw, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs rounded-md font-mono"
              >
                #{kw.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Related Step-by-Step Guides</span>
              </h3>
              <button
                onClick={onBackToBlog}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all 100 →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <div
                  key={related.id}
                  onClick={() => onSelectPost(related.id)}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      Topic #{related.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug hover:text-blue-600">
                      {related.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                    <span>Read Guide</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
