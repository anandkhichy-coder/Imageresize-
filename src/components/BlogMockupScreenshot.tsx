import React from 'react';
import { ToolId } from '../types';
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
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sliders,
  Layers,
  Download
} from 'lucide-react';

interface BlogMockupProps {
  toolType: string;
  associatedTool: ToolId;
  toolName: string;
  caption: string;
  onLaunchTool: (toolId: ToolId) => void;
}

export const BlogMockupScreenshot: React.FC<BlogMockupProps> = ({
  toolType,
  associatedTool,
  toolName,
  caption,
  onLaunchTool,
}) => {
  return (
    <div className="my-8 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* Browser / App Window Chrome */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs font-mono text-slate-400">imageresize.store — Official Tool Workspace</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            100% Client-Side RAM
          </span>
        </div>
      </div>

      {/* Simulated Live UI Layout */}
      <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100/50">
        {/* Tool Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              {associatedTool === 'compressor' && <Minimize2 className="w-5 h-5" />}
              {associatedTool === 'resizer' && <Maximize2 className="w-5 h-5" />}
              {associatedTool === 'bg-remover' && <Eraser className="w-5 h-5" />}
              {associatedTool === 'img-to-pdf' && <FileText className="w-5 h-5" />}
              {associatedTool === 'passport' && <UserSquare2 className="w-5 h-5" />}
              {associatedTool === 'whatsapp-dp' && <MessageSquare className="w-5 h-5" />}
              {associatedTool === 'govt-form' && <FileCheck2 className="w-5 h-5" />}
              {associatedTool === 'converter' && <RefreshCw className="w-5 h-5" />}
              {associatedTool === 'cropper' && <Crop className="w-5 h-5" />}
              {associatedTool === 'heic-to-jpg' && <Smartphone className="w-5 h-5" />}
              {associatedTool === 'bulk-compress' && <Layers className="w-5 h-5" />}
              {associatedTool === 'target-kb' && <Sliders className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">{toolName}</h4>
              <p className="text-xs text-slate-500">Live preview & automated configuration pipeline</p>
            </div>
          </div>

          <button
            onClick={() => onLaunchTool(associatedTool)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Open Interactive Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Mockup Content Based on Tool Type */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left: Interactive Preset Matrix */}
          <div className="md:col-span-5 space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Selected Parameters</span>
              <span className="text-[10px] text-blue-600 font-bold">Auto-Calibrated</span>
            </div>

            {toolType === 'compressor' || associatedTool === 'compressor' ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-1.5">
                  <span className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold text-center">
                    Target 50KB
                  </span>
                  <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium text-center">
                    Target 20KB
                  </span>
                  <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium text-center">
                    Target 100KB
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Input Size:</span>
                    <span className="font-semibold text-slate-800">4.2 MB (Camera RAW)</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Target Output:</span>
                    <span>47.8 KB (-98.8% Saved)</span>
                  </div>
                </div>
              </div>
            ) : toolType === 'passport' || associatedTool === 'passport' ? (
              <div className="space-y-2.5">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-xs space-y-1">
                  <p className="font-bold text-blue-900">Preset: India / Schengen (35x45mm)</p>
                  <p className="text-blue-700 text-[11px]">413 × 531 px at 300 DPI — Pure White BG</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Face Biometric 70-80% Fit</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>4x6 Inch Multi-Photo Grid Ready</span>
                </div>
              </div>
            ) : toolType === 'bg-remover' || associatedTool === 'bg-remover' ? (
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-md">
                    AI Auto-Segment
                  </span>
                  <span className="text-xs text-slate-500">1-Click Precision</span>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs text-slate-600">Backdrop:</span>
                  <div className="flex space-x-1.5">
                    <span className="w-5 h-5 rounded-full border border-slate-300 bg-white" title="White BG"></span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 bg-slate-900" title="Dark BG"></span>
                    <span className="w-5 h-5 rounded-full border border-blue-500 bg-blue-600 ring-2 ring-blue-300" title="Studio Blue"></span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:6px_6px]" title="Transparent PNG"></span>
                  </div>
                </div>
              </div>
            ) : toolType === 'img-to-pdf' || associatedTool === 'img-to-pdf' ? (
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>Layout:</span>
                    <span className="font-bold text-blue-600">Standard A4 Portrait</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Margin:</span>
                    <span>Compact (5mm)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Page Order:</span>
                    <span>Drag & Drop Sequence</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-900 font-medium">
                  Instant WebAssembly Processing Engine
                </div>
                <div className="text-slate-500 text-[11px]">
                  Aspect ratio lock enabled • Bicubic subpixel interpolation active
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => onLaunchTool(associatedTool)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch {toolName}</span>
              </button>
            </div>
          </div>

          {/* Right: Visual Canvas Preview Mockup */}
          <div className="md:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[190px]">
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2 border-b border-slate-100 mb-3">
              <span>Source: DSC_0921.JPG</span>
              <span className="text-emerald-600 font-semibold">Ready for Download</span>
            </div>

            <div className="relative w-full max-w-[280px] h-[120px] rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {/* Visual Split-Screen / Tool Mock Illustration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-slate-100 flex items-center justify-around px-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-14 bg-white border border-slate-300 rounded shadow-sm mx-auto flex items-center justify-center text-slate-400">
                    <UserSquare2 className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block">Original Photo</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow">
                    →
                  </div>
                  <span className="text-[9px] text-blue-600 font-bold mt-1">Instant</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-12 h-14 bg-white border-2 border-emerald-500 rounded shadow-md mx-auto flex items-center justify-center text-emerald-600 relative overflow-hidden">
                    <UserSquare2 className="w-6 h-6 text-emerald-600" />
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-bold text-center">
                      50 KB
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 block">Optimized JPG</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero server upload • Processed directly in your browser</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Caption Footer */}
      <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-600 font-medium italic">
          📸 <span className="font-semibold text-slate-800">Screenshot:</span> {caption}
        </p>
      </div>
    </div>
  );
};
