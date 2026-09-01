import React, { useState, useRef, useEffect } from 'react';
import { 
  Minimize2, 
  Maximize2,
  Eraser,
  FileText,
  UserSquare2,
  MessageSquare,
  FileCheck2,
  RefreshCw,
  Crop,
  Smartphone,
  Layers,
  Sliders,
  Sparkles, 
  ShieldCheck, 
  Search, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { ToolId, PageView, BlogCategory } from '../types';
import { TOOLS_LIST } from '../data/toolsData';
import { ALL_BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogs';

interface NavbarProps {
  currentView: PageView;
  activeTool: ToolId;
  onNavigateHome: () => void;
  onSelectTool: (id: ToolId) => void;
  onNavigateBlog: (category?: BlogCategory) => void;
  onNavigateToolsDirectory: () => void;
  onSelectBlogPost: (id: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeTool,
  onNavigateHome,
  onSelectTool,
  onNavigateBlog,
  onNavigateToolsDirectory,
  onSelectBlogPost,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileBlogExpanded, setMobileBlogExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter both tools and blogs for the universal live search
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchingTools = TOOLS_LIST.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.keywords.some(k => k.toLowerCase().includes(q)) ||
      t.tagline.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchingBlogs = ALL_BLOG_POSTS.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.keywords.some(k => k.toLowerCase().includes(q)) ||
      b.excerpt.toLowerCase().includes(q)
    ).slice(0, 5);

    return { tools: matchingTools, blogs: matchingBlogs };
  }, [searchQuery]);

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

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'compress': return <Minimize2 className="w-4 h-4 text-blue-600" />;
      case 'resize': return <Maximize2 className="w-4 h-4 text-indigo-600" />;
      case 'convert': return <RefreshCw className="w-4 h-4 text-emerald-600" />;
      case 'bg-edit': return <Eraser className="w-4 h-4 text-purple-600" />;
      case 'mobile-social': return <Smartphone className="w-4 h-4 text-pink-600" />;
      case 'tips-info': return <Sparkles className="w-4 h-4 text-amber-600" />;
      default: return <BookOpen className="w-4 h-4 text-blue-600" />;
    }
  };

  // 6 Top High-Intent Guides for the Mega Menu
  const megaMenuFeaturedPosts = React.useMemo(() => {
    return ALL_BLOG_POSTS.filter(p => [1, 4, 29, 49, 66, 81].includes(p.id));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Minimize2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  imageresize<span className="text-blue-600">.store</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  FREE
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Compress to 50KB • Resize • Remove BG • 100 Guides
              </p>
            </div>
          </div>

          {/* Universal Live Search Bar */}
          <div ref={searchRef} className="hidden md:flex items-center flex-1 max-w-md mx-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              placeholder="Search 12 tools & 100 guides: 50KB, Passport, PDF..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Live Search Results Dropdown */}
            {searchFocused && searchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[460px] overflow-y-auto z-50 p-3 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1">
                {/* Tools Matches */}
                {searchResults.tools.length > 0 && (
                  <div className="pb-2">
                    <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                      Matching Tools ({searchResults.tools.length})
                    </p>
                    <div className="space-y-1 mt-1">
                      {searchResults.tools.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTool(t.id);
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full p-2 rounded-xl text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                              {getToolIcon(t.id)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                {t.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate max-w-[240px]">
                                {t.tagline}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                            Launch Tool
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blogs Matches */}
                {searchResults.blogs.length > 0 && (
                  <div className="pt-2">
                    <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <BookOpen className="w-3 h-3 mr-1 text-indigo-500" />
                      Matching Guides ({searchResults.blogs.length})
                    </p>
                    <div className="space-y-1 mt-1">
                      {searchResults.blogs.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            onSelectBlogPost(b.id);
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full p-2 rounded-xl text-left hover:bg-indigo-50/70 flex items-center justify-between group transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                              #{b.id}: {b.title}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center space-x-2">
                              <span>{b.categoryLabel}</span>
                              <span>•</span>
                              <span>{b.readTime}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                            Read →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.tools.length === 0 && searchResults.blogs.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching tools or guides found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* Home Link */}
            <button
              onClick={onNavigateHome}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                currentView === 'home'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Tools dropdown */}
            <div className="relative">
              <button
                id="all-tools-dropdown-btn"
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setBlogDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                  toolsDropdownOpen || currentView === 'all-tools'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>Tools (12)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setToolsDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 max-h-[500px] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1">
                    <div className="p-2 bg-slate-50 rounded-xl mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">All 12 Online Tools</span>
                      <button
                        onClick={() => {
                          onNavigateToolsDirectory();
                          setToolsDropdownOpen(false);
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        View Catalog →
                      </button>
                    </div>

                    <div className="py-1 space-y-1">
                      {TOOLS_LIST.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onSelectTool(tool.id);
                            setToolsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                            activeTool === tool.id && currentView === tool.id
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              {getToolIcon(tool.id)}
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-semibold truncate">{tool.name}</div>
                              <div className="text-[10px] text-slate-500 truncate">{tool.tagline}</div>
                            </div>
                          </div>
                          {tool.badge && (
                            <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 ml-1">
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Rich Blog (100 Guides) Mega Menu */}
            <div className="relative">
              <button
                id="nav-blog-mega-menu-btn"
                onClick={() => {
                  setBlogDropdownOpen(!blogDropdownOpen);
                  setToolsDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                  blogDropdownOpen || currentView === 'blog-hub' || currentView === 'blog-post'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
                    : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Blog (100 Guides)</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ml-0.5 ${
                  blogDropdownOpen || currentView === 'blog-hub' || currentView === 'blog-post'
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  100
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${blogDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {blogDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setBlogDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-[680px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-5 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1">
                    {/* Mega Menu Top Header */}
                    <div className="pb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">
                            100 Image Editing Master Guides
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Complete collection of tutorials, exam rules, dimensions & pro tips
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onNavigateBlog();
                          setBlogDropdownOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <span>Browse All 100 Guides</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 6 Category Breakdown Grid */}
                    <div className="py-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Browse by Category
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {BLOG_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              onNavigateBlog(cat.id as BlogCategory);
                              setBlogDropdownOpen(false);
                            }}
                            className="p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-left transition-all group flex items-start space-x-2.5"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                              {getCategoryIcon(cat.id)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                                  {cat.label}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {cat.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Top 6 Spotlight Quick Links */}
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1 text-amber-500" />
                          Top Trending Guides
                        </span>
                        <span className="text-[10px] text-slate-400">1-Click Direct Access</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {megaMenuFeaturedPosts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => {
                              onSelectBlogPost(post.id);
                              setBlogDropdownOpen(false);
                            }}
                            className="p-2 rounded-lg text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          >
                            <div className="space-y-0.5 truncate pr-2">
                              <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                                #{post.id}: {post.title}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {post.categoryLabel} • {post.readTime}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 50KB Shortcut */}
            <button
              id="nav-compress-50kb"
              onClick={() => onSelectTool('compressor')}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                activeTool === 'compressor' && currentView === 'compressor'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200 hover:text-blue-700'
              }`}
            >
              50KB Compress
            </button>

            {/* Passport Shortcut */}
            <button
              id="nav-passport-maker"
              onClick={() => onSelectTool('passport')}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                activeTool === 'passport' && currentView === 'passport'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200 hover:text-blue-700'
              }`}
            >
              Passport 35x45
            </button>

            {/* Privacy Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden xl:inline">Client-Side Privacy</span>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 12 tools & 100 blog guides..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 text-xs rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {menuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 max-h-[75vh] overflow-y-auto space-y-4 pb-6">
            {/* Quick Views */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <span>🏠 Home</span>
              </button>
              <button
                onClick={() => {
                  onNavigateBlog();
                  setMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Blog (100 Guides)</span>
              </button>
            </div>

            {/* Mobile Blog Guides Section */}
            <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100 space-y-2">
              <button
                onClick={() => setMobileBlogExpanded(!mobileBlogExpanded)}
                className="w-full flex items-center justify-between text-xs font-bold text-indigo-900"
              >
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>100 Image Editing Guides</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform ${mobileBlogExpanded ? 'rotate-180' : ''}`} />
              </button>

              {mobileBlogExpanded && (
                <div className="pt-2 space-y-1.5">
                  <button
                    onClick={() => {
                      onNavigateBlog();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-between"
                  >
                    <span>View All 100 Guides</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {BLOG_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onNavigateBlog(cat.id as BlogCategory);
                          setMenuOpen(false);
                        }}
                        className="p-2 rounded-lg bg-white border border-indigo-100 text-left text-[11px] font-semibold text-slate-800 hover:bg-indigo-50 flex items-center space-x-1.5"
                      >
                        {getCategoryIcon(cat.id)}
                        <span className="truncate">{cat.label.split(' (')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile 12 Tools List */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase">
                All 12 Image Editing Tools
              </div>
              {TOOLS_LIST.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                    activeTool === tool.id && currentView === tool.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getToolIcon(tool.id)}
                    <span>{tool.name}</span>
                  </div>
                  {tool.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      activeTool === tool.id ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tool.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
