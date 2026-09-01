import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { GOVT_PRESETS } from '../data/toolsData';
import { GovtPreset } from '../types';
import { loadImage, resizeImage, compressImageToTargetKB, cleanSignatureCanvas, downloadBlob, formatBytes } from '../utils/imageUtils';

export const GovtFormResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<GovtPreset>(GOVT_PRESETS[0]);
  const [autoCleanInk, setAutoCleanInk] = useState<boolean>(true);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    setErrorMsg(null);
    setFile(selectedFile);
    setResultBlob(null);
    setResultUrl('');
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    try {
      const img = await loadImage(url);
      setImageEl(img);
    } catch (err) {
      setErrorMsg('Failed to load image. Please try another file.');
    }
  };

  const processGovtForm = async () => {
    if (!imageEl || !file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      let workingImg = imageEl;

      if (selectedPreset.type === 'signature' && autoCleanInk) {
        const cleanedBlob = await cleanSignatureCanvas(imageEl, 180);
        const cleanedUrl = URL.createObjectURL(cleanedBlob);
        workingImg = await loadImage(cleanedUrl);
      }

      const resizedBlob = await resizeImage(
        workingImg,
        selectedPreset.recommendedWidth,
        selectedPreset.recommendedHeight,
        'image/jpeg',
        0.92,
        selectedPreset.dpi
      );
      const resizedImg = await loadImage(URL.createObjectURL(resizedBlob));

      const compressed = await compressImageToTargetKB(
        resizedImg,
        selectedPreset.targetKB,
        'image/jpeg'
      );

      setResultBlob(compressed.blob);
      const url = URL.createObjectURL(compressed.blob);
      setResultUrl(url);
    } catch (err: any) {
      console.error('Govt Form Resizer error', err);
      setErrorMsg('Error generating compliant image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resultBlob, `${base}_${selectedPreset.name.toLowerCase().replace(/\s+/g, '_')}.jpg`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setResultBlob(null);
    setResultUrl('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectPresetQuickly = (presetId: string) => {
    const found = GOVT_PRESETS.find(p => p.id === presetId);
    if (found) setSelectedPreset(found);
    if (!file) fileInputRef.current?.click();
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Government Exam Form Photo & Signature Resizer
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Instant 1-click compliance for SSC, UPSC, IBPS, SBI, GATE, NEET & State PSC application portals
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ⚡ 100% Portal Acceptance
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Upload Zone */}
        {!file && (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-600', 'bg-blue-50/50');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-blue-600', 'bg-blue-50/50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-600', 'bg-blue-50/50');
                if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-blue-200 hover:border-blue-600 rounded-2xl p-10 sm:p-14 text-center cursor-pointer bg-[#F8FBFF] hover:bg-[#EFF6FF] transition-all relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <span className="text-5xl mb-3 block select-none group-hover:scale-110 transition-transform">
                🖼️
              </span>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Click here to upload exam photo or signature
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Max 20MB
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo / Signature
              </span>
            </div>

            {/* Exam Quick Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => selectPresetQuickly('ssc-cgl-photo')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> SSC CGL/CHSL Photo (20-50 KB)
              </button>
              <button 
                onClick={() => selectPresetQuickly('ssc-cgl-sig')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>✍️</span> SSC Signature (10-20 KB)
              </button>
              <button 
                onClick={() => selectPresetQuickly('upsc-photo')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🏛️</span> UPSC Civil Services Photo
              </button>
              <button 
                onClick={() => selectPresetQuickly('ibps-photo')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🏦</span> IBPS / SBI Bank PO Photo
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm text-red-700 flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Workspace when file loaded */}
        {file && (
          <div className="space-y-6">
            
            {/* Exam Presets Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Indian Recruitment Portal Preset:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GOVT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPreset(p)}
                    className={`p-2.5 text-left rounded-xl border transition-all ${
                      selectedPreset.id === p.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{p.name}</div>
                    <div className={`text-[11px] ${selectedPreset.id === p.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {p.targetKB} KB • {p.recommendedWidth}x{p.recommendedHeight}px
                    </div>
                  </button>
                ))}
              </div>

              {selectedPreset.type === 'signature' && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCleanInk}
                      onChange={(e) => setAutoCleanInk(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Auto-Clean Paper Shadows (Pure White Background)</span>
                  </label>
                </div>
              )}

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processGovtForm}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>
                    {resultUrl ? `📄 Re-Generate ${selectedPreset.name}` : `📄 Generate ${selectedPreset.name}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Original Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span>Original Upload</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-h-[260px] max-w-full object-contain rounded-md"
                  />
                </div>
              </div>

              {/* Compliant Result Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">{selectedPreset.name}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    {resultBlob ? formatBytes(resultBlob.size) : `${selectedPreset.targetKB} KB Limit`}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center text-center">
                  {resultUrl ? (
                    <img 
                      src={resultUrl} 
                      alt="Compliant Result" 
                      className="max-h-[260px] max-w-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        📄
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Choose exam preset above and click <strong>"Generate {selectedPreset.name}"</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {resultUrl ? (
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    Download Compliant {selectedPreset.name} ({resultBlob ? formatBytes(resultBlob.size) : `${selectedPreset.targetKB} KB`})
                  </span>
                </button>
              ) : (
                <button
                  onClick={processGovtForm}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Generate Compliant Photo</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Image</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Info Grid at Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">📋</div>
          <h3 className="font-bold text-sm text-slate-900">100% Portal Acceptance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Exact matching for pixel dimensions, aspect ratio, 200 DPI resolution, and max KB file limits.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">✍️</div>
          <h3 className="font-bold text-sm text-slate-900">Signature Background Cleaner</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Whitens dim paper background and darkens blue/black ink strokes for zero rejection by automated scanners.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">Zero Server Data Storage</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict client-side execution protects your identity and biometric signatures with complete offline privacy.
          </p>
        </div>
      </div>

    </div>
  );
};
