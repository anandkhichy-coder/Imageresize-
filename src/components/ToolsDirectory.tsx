import React from 'react';
import { ToolId } from '../types';
import { TOOLS_LIST } from '../data/toolsData';
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
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ToolsDirectoryProps {
  onSelectTool: (toolId: ToolId) => void;
}

export const ToolsDirectory: React.FC<ToolsDirectoryProps> = ({ onSelectTool }) => {
  const getToolIcon = (id: ToolId) => {
    switch (id) {
      case 'compressor': return <Minimize2 className="w-6 h-6" />;
      case 'resizer': return <Maximize2 className="w-6 h-6" />;
      case 'bg-remover': return <Eraser className="w-6 h-6" />;
      case 'img-to-pdf': return <FileText className="w-6 h-6" />;
      case 'passport': return <UserSquare2 className="w-6 h-6" />;
      case 'whatsapp-dp': return <MessageSquare className="w-6 h-6" />;
      case 'govt-form': return <FileCheck2 className="w-6 h-6" />;
      case 'converter': return <RefreshCw className="w-6 h-6" />;
      case 'cropper': return <Crop className="w-6 h-6" />;
      case 'heic-to-jpg': return <Smartphone className="w-6 h-6" />;
      case 'bulk-compress': return <Layers className="w-6 h-6" />;
      case 'target-kb': return <Sliders className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-400/20">
          All Free Online Image Tools
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Complete Image Suite Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Every tool runs 100% in your browser memory with zero file uploads, zero watermarks, and zero daily limits.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_LIST.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all cursor-pointer p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                    {getToolIcon(tool.id)}
                  </div>
                  {tool.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {tool.shortName}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tool.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {tool.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      #{kw.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool Online</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
