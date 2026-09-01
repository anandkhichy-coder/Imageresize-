import React, { useState, useMemo } from 'react';
import { BlogPost, BlogCategory, ToolId } from '../types';
import { ALL_BLOG_POSTS, BLOG_CATEGORIES, searchBlogPosts } from '../data/blogs';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Tag, 
  Layers, 
  SlidersHorizontal,
  X,
  TrendingUp,
  Minimize2,
  Maximize2,
  RefreshCw,
  Eraser,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

interface BlogHubProps {
  onSelectPost: (id: number) => void;
  onLaunchTool: (toolId: ToolId) => void;
  initialCategory?: BlogCategory | 'all';
}

export const BlogHub: React.FC<BlogHubProps> = ({
  onSelectPost,
  onLaunchTool,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>(initialCategory);
  const [page, setPage] = useState(1);
  const postsPerPage = 12;

  // Update category when initialCategory prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setPage(1);
    }
  }, [initialCategory]);

  // Filter & Search
  const filteredPosts = useMemo(() => {
    return searchBlogPosts(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const displayedPosts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, page]);

  // Featured / Top Intent Articles (#1, #4, #26, #29, #49, #66, #81, #95)
  const topTenPosts = useMemo(() => {
    return ALL_BLOG_POSTS.filter(p => [1, 4, 26, 29, 46, 49, 66, 68, 75, 81, 90, 95].includes(p.id));
  }, []);

  const handleCategorySelect = (catId: BlogCategory | 'all') => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const handleQuickTagClick = (tagQuery: string) => {
    setSearchQuery(tagQuery);
    setSelectedCategory('all');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Blog Hub Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background ambient elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>100 SEO & Human-Friendly Image Editing Master Guides</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Image Editing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Knowledge Base & Guides</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Instant, step-by-step tutorials with exact dimensions, target KB formulas, and live interactive tool access for government exams, social media, e-commerce, and passport creation.
          </p>

          {/* Master Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search all 100 topics (e.g. 50KB, Aadhaar, Passport 35x45, WhatsApp DP, HEIC, Remove BG)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-900/90 text-sm shadow-xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Trending Quick Search Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
              <span className="text-slate-400 flex items-center mr-1">
                <TrendingUp className="w-3 h-3 mr-1 text-amber-400" />
                Trending:
              </span>
              {[
                { label: '50KB Compress', q: '50KB' },
                { label: 'Passport 35x45mm', q: '35x45mm' },
                { label: 'Aadhaar Photo', q: 'Aadhaar' },
                { label: 'HEIC to JPG', q: 'HEIC' },
                { label: 'WhatsApp DP', q: 'WhatsApp DP' },
                { label: 'Remove BG', q: 'Remove Background' },
                { label: '20KB Signature', q: '20KB' },
                { label: 'Image to PDF', q: 'PDF' },
              ].map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => handleQuickTagClick(pill.q)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all font-medium"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 High-Intent Spotlight Section */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  ⭐
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Most Searched High-Intent Topics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Highest search volume for Government Forms, WhatsApp, Passport & iPhone HEIC
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Top Guides
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {topTenPosts.slice(0, 6).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post.id)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">#{post.id} {post.categoryLabel}</span>
                      <span className="text-slate-400">{post.readTime}</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{post.toolName}</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Explore by Category
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredPosts.length} of 100 Posts
          </span>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {BLOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main 100 Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No matching guides found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try searching for 50KB, Passport, or Resizing.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3">
                  {/* Category & Topic Number */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      Topic #{post.id}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectPost(post.id)}
                    className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Keywords Preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.keywords.slice(0, 2).map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        #{kw.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Card */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onLaunchTool(post.associatedTool)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 flex items-center space-x-1"
                    title={`Open ${post.toolName}`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{post.toolName}</span>
                  </button>

                  <button
                    onClick={() => onSelectPost(post.id)}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = page === pageNum;
                // Display limited page numbers if totalPages is large
                if (totalPages > 8 && Math.abs(pageNum - page) > 3 && pageNum !== 1 && pageNum !== totalPages) {
                  if (Math.abs(pageNum - page) === 4) {
                    return <span key={pageNum} className="text-xs text-slate-400 px-1">...</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
