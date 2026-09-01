import React, { useState } from 'react';
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
  ShieldCheck, 
  Zap, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  ChevronDown
} from 'lucide-react';
import { ToolId } from '../types';
import { TOOLS_LIST, SEO_FAQS } from '../data/toolsData';
import { ImageCompressor } from './ImageCompressor';

interface HomePageProps {
  onSelectTool: (id: ToolId) => void;
  onNavigateToolsDirectory: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onNavigateToolsDirectory,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getToolIcon = (id: ToolId) => {
    switch (id) {
      case 'compressor': return <Minimize2 className="w-5 h-5" />;
      case 'resizer': return <Maximize2 className="w-5 h-5" />;
      case 'bg-remover': return <Eraser className="w-5 h-5" />;
      case 'img-to-pdf': return <FileText className="w-5 h-5" />;
      case 'passport': return <UserSquare2 className="w-5 h-5" />;
      case 'whatsapp-dp': return <MessageSquare className="w-5 h-5" />;
      case 'govt-form': return <FileCheck2 className="w-5 h-5" />;
      case 'converter': return <RefreshCw className="w-5 h-5" />;
      case 'cropper': return <Crop className="w-5 h-5" />;
      case 'heic-to-jpg': return <Smartphone className="w-5 h-5" />;
      case 'bulk-compress': return <Layers className="w-5 h-5" />;
      case 'target-kb': return <Sliders className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Welcome Banner */}
      <section className="text-center space-y-4 pt-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side Privacy • Zero Cloud Uploads • 12 Standalone Tools</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Compress, Resize & Edit Photos <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Strictly to 50KB & Exact Dimensions
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The ultimate in-browser image suite tailored for Indian government exam forms (SSC, UPSC, State PSC, Bank PO), passport photos, WhatsApp DP without crop, and AI background removal.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onSelectTool('compressor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Open 50KB Compressor</span>
          </button>

          <button
            onClick={() => {
              onSelectTool('bg-remover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm shadow-xs flex items-center space-x-2 transition-all"
          >
            <Eraser className="w-4 h-4 text-purple-600" />
            <span>Open Background Remover</span>
          </button>

          <button
            onClick={() => {
              onNavigateToolsDirectory();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm shadow-xs flex items-center space-x-2 transition-all"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Browse All 12 Tools</span>
          </button>
        </div>
      </section>

      {/* Instant Quick-Compressor Widget on Homepage */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Instant Utility</span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Quick 50KB / 20KB Target Compressor
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectTool('compressor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Open Dedicated Tool Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ImageCompressor initialTargetKB={50} />
      </section>

      {/* 12 Standalone Tools Directory Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Complete Suite</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Explore All 12 Standalone Tools
            </h2>
            <p className="text-xs text-slate-500">Each tool has its own dedicated workspace with customized parameters & guides.</p>
          </div>

          <button
            onClick={() => {
              onNavigateToolsDirectory();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>View Tools Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS_LIST.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                onSelectTool(tool.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {getToolIcon(tool.id)}
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.shortName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tool.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Open Dedicated Page</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col items-start space-y-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Exact 50KB / 20KB Calibration
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Engineered specifically for government recruitment forms where photos & signatures must strictly stay under 50KB or 20KB.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col items-start space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            100% Client-Side Privacy
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All compression, resizing, and background removal occurs directly in your local browser via WebAssembly. Your photos are never uploaded.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col items-start space-y-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            High Definition Quality Preservation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Bicubic resampling algorithms prevent facial blur, signature distortion, and pixelation while strictly adhering to 300 DPI standards.
          </p>
        </div>
      </section>

      {/* Government Exam Form Size Cheat Sheet */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Cheat Sheet</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Indian Government Exam Photo & Signature Rules
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Exact file specifications required by major recruitment boards and government portals.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Exam / Portal</th>
                <th className="p-3">Photo Size Limit</th>
                <th className="p-3">Signature Limit</th>
                <th className="p-3">Recommended Pixels</th>
                <th className="p-3">Quick Tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-bold text-slate-900">SSC CGL / CHSL / MTS</td>
                <td className="p-3 text-blue-600 font-bold">20 KB – 50 KB</td>
                <td className="p-3 text-blue-600 font-bold">10 KB – 20 KB</td>
                <td className="p-3">3.5cm x 4.5cm (138x177 px)</td>
                <td className="p-3">
                  <button 
                    onClick={() => { onSelectTool('govt-form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Open Resizer →
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">UPSC Civil Services / NDA</td>
                <td className="p-3 text-blue-600 font-bold">20 KB – 300 KB</td>
                <td className="p-3 text-blue-600 font-bold">20 KB – 300 KB</td>
                <td className="p-3">350 x 350 px min</td>
                <td className="p-3">
                  <button 
                    onClick={() => { onSelectTool('govt-form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Open Resizer →
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">IBPS / SBI Bank PO</td>
                <td className="p-3 text-blue-600 font-bold">20 KB – 50 KB</td>
                <td className="p-3 text-blue-600 font-bold">10 KB – 20 KB</td>
                <td className="p-3">200 x 230 px (Photo), 140 x 60 px (Sign)</td>
                <td className="p-3">
                  <button 
                    onClick={() => { onSelectTool('compressor'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Open Compressor →
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Aadhaar Card Update Portal</td>
                <td className="p-3 text-blue-600 font-bold">Under 2 MB</td>
                <td className="p-3 text-blue-600 font-bold">N/A</td>
                <td className="p-3">Passport ratio (White BG)</td>
                <td className="p-3">
                  <button 
                    onClick={() => { onSelectTool('passport'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Passport Maker →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Structured FAQs Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center space-x-2">
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
      </section>

    </div>
  );
};
