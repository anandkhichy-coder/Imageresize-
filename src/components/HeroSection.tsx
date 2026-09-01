import React from 'react';
import { 
  Minimize2, 
  Maximize2, 
  Eraser, 
  FileText, 
  UserSquare2, 
  Smile, 
  Award, 
  RefreshCw, 
  Smartphone, 
  Layers, 
  Crop, 
  Sliders,
  CheckCircle,
  Zap,
  Sparkles
} from 'lucide-react';
import { ToolId } from '../types';
import { TOOLS_LIST } from '../data/toolsData';

interface HeroSectionProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  searchQuery: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Minimize2: <Minimize2 className="w-4 h-4" />,
  Maximize2: <Maximize2 className="w-4 h-4" />,
  Eraser: <Eraser className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  UserSquare2: <UserSquare2 className="w-4 h-4" />,
  Smile: <Smile className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Crop: <Crop className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />,
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeTool,
  onSelectTool,
  searchQuery,
}) => {
  const filteredTools = React.useMemo(() => {
    if (!searchQuery.trim()) return TOOLS_LIST;
    const q = searchQuery.toLowerCase();
    return TOOLS_LIST.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const activeMeta = TOOLS_LIST.find((t) => t.id === activeTool) || TOOLS_LIST[0];

  return (
    <div className="bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50 border-b border-slate-200/80 pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEO Main Banner Heading */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast, Free & 100% Private In-Browser Image Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {activeMeta.seoTitle.split('—')[0]}
            <span className="text-blue-600 block sm:inline sm:ml-2">
              {activeMeta.seoTitle.includes('—') ? `— ${activeMeta.seoTitle.split('—')[1]}` : ''}
            </span>
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {activeMeta.seoDescription}
          </p>

          {/* Key SEO Highlights Bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> No Registration
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Unlimited Free Conversions
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Zero Upload to Cloud / Full Privacy
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Instant HD Downloads
            </span>
          </div>
        </div>

        {/* SEO-Optimized Tools Carousel / Filterable Pill Tabs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Tools ({filteredTools.length})
            </span>
            {searchQuery && (
              <span className="text-xs text-blue-600 font-medium">
                Showing results for &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredTools.map((tool) => {
              const isSelected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  id={`tool-tab-${tool.id}`}
                  onClick={() => onSelectTool(tool.id)}
                  className={`group relative flex flex-col items-start text-left p-3 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-600/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}
                    >
                      {iconMap[tool.icon] || <Zap className="w-4 h-4" />}
                    </div>

                    {tool.badge && (
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide ${
                          isSelected
                            ? 'bg-white text-blue-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold leading-snug line-clamp-1">
                    {tool.shortName}
                  </span>
                  
                  <span
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {tool.id === 'compressor' || tool.id === 'target-kb'
                      ? 'To 20KB/50KB/100KB'
                      : tool.tagline.split(' ')[0] + ' ' + (tool.tagline.split(' ')[1] || '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
