import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Zap, 
  Check, 
  Sparkles, 
  AlertCircle,
  Sliders, 
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { formatBytes, loadImage, compressImageToTargetKB, compressImageWithQuality, downloadBlob } from '../utils/imageUtils';

interface ImageCompressorProps {
  initialTargetKB?: number;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({ initialTargetKB = 50 }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<'targetKB' | 'manualQuality'>('targetKB');
  
  // Target KB parameters
  const [targetKB, setTargetKB] = useState<number>(initialTargetKB);
  const [qualityPercent, setQualityPercent] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  
  // Results state
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Compressing...');
  const [savedPercent, setSavedPercent] = useState<number>(0);
  const [appliedQuality, setAppliedQuality] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file select
  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    setErrorMsg(null);
    setFile(selectedFile);
    setCompressedBlob(null);
    setCompressedUrl('');
    setSavedPercent(0);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    try {
      const img = await loadImage(objectUrl);
      setImageEl(img);
    } catch (err) {
      setErrorMsg('Failed to load image. Please try another file.');
    }
  };

  // Process compression function called on button click
  const processCompression = async () => {
    if (!imageEl || !file) return;
    setIsProcessing(true);
    setProgressPct(30);
    setStatusMsg('Optimizing image in browser memory...');
    setErrorMsg(null);
    
    try {
      if (mode === 'targetKB') {
        setProgressPct(60);
        const res = await compressImageToTargetKB(imageEl, targetKB, outputFormat);
        setCompressedBlob(res.blob);
        const newUrl = URL.createObjectURL(res.blob);
        setCompressedUrl(newUrl);
        setCompressedDimensions({ width: res.width, height: res.height });
        setAppliedQuality(Math.round(res.quality * 100));

        if (file.size > 0) {
          const saved = Math.max(0, Math.round(((file.size - res.blob.size) / file.size) * 100));
          setSavedPercent(saved);
        }
      } else {
        setProgressPct(60);
        const q = Math.max(0.05, Math.min(1.0, qualityPercent / 100));
        const res = await compressImageWithQuality(imageEl, q, outputFormat);
        setCompressedBlob(res.blob);
        const newUrl = URL.createObjectURL(res.blob);
        setCompressedUrl(newUrl);
        setCompressedDimensions({ width: res.width, height: res.height });
        setAppliedQuality(qualityPercent);

        if (file.size > 0) {
          const saved = Math.max(0, Math.round(((file.size - res.blob.size) / file.size) * 100));
          setSavedPercent(saved);
        }
      }
      setProgressPct(100);
      setStatusMsg('✅ Compression complete!');
    } catch (err: any) {
      console.error('Compression error:', err);
      setErrorMsg('Error compressing image. Try a different file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const base = file.name.replace(/\.[^/.]+$/, '');
    const suffix = mode === 'targetKB' ? `_${targetKB}kb` : `_optimized`;
    downloadBlob(compressedBlob, `${base}${suffix}.${ext}`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setCompressedBlob(null);
    setCompressedUrl('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setPresetKB = (kb: number) => {
    setMode('targetKB');
    setTargetKB(kb);
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Compress Image to 50KB / 20KB Free Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Target exact KB file size for Indian government exam forms, signatures & passport portals
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ⚡ Exact KB Precision
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Upload Zone (Visible when no file selected) */}
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
                Click here to upload image
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Max 20MB
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Quick Use Cases Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => setPresetKB(50)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> SSC / UPSC 50KB Photo
              </button>
              <button 
                onClick={() => setPresetKB(20)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>✍️</span> 20KB Signature
              </button>
              <button 
                onClick={() => setPresetKB(50)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🪪</span> Aadhaar Form 50KB
              </button>
              <button 
                onClick={() => setPresetKB(100)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>💼</span> Bank PO 100KB Photo
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="py-6 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 font-bold text-slate-800 text-sm sm:text-base">
              <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span>{statusMsg}</span>
            </div>
            <div className="w-full max-w-md mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">Calibrating quality to exact target KB...</p>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm text-red-700 flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Workspace (When file is loaded) */}
        {file && !isProcessing && (
          <div className="space-y-6">
            
            {/* Target Size Controls Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Set Target Compression Parameters
                </span>
                
                <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                  <button
                    onClick={() => setMode('targetKB')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      mode === 'targetKB' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Exact KB Target
                  </button>
                  <button
                    onClick={() => setMode('manualQuality')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      mode === 'manualQuality' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Manual Quality %
                  </button>
                </div>
              </div>

              {mode === 'targetKB' ? (
                <div className="space-y-3">
                  {/* Preset Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[20, 50, 100, 200, 500].map((kb) => (
                      <button
                        key={kb}
                        onClick={() => setTargetKB(kb)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          targetKB === kb
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {kb} KB {kb === 50 ? '(Govt Form)' : kb === 20 ? '(Signature)' : ''}
                      </button>
                    ))}
                  </div>

                  {/* Custom Target KB Input */}
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      Custom Target:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="10000"
                        value={targetKB}
                        onChange={(e) => setTargetKB(Math.max(5, parseInt(e.target.value) || 50))}
                        className="w-24 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-500">KB</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Quality Level: {qualityPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={qualityPercent}
                    onChange={(e) => setQualityPercent(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processCompression}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {compressedUrl ? '⚡ Re-Generate Compressed Image' : '⚡ Generate Compressed Image'}
                  </span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Original Image Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span>Original Photo</span>
                  <span className="font-mono text-slate-700">{formatBytes(file.size)}</span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-h-[260px] max-w-full object-contain rounded-md"
                  />
                </div>
              </div>

              {/* Compressed Image Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">Compressed Result</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                      {compressedBlob ? formatBytes(compressedBlob.size) : 'Ready to Generate'}
                    </span>
                    {savedPercent > 0 && (
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                        -{savedPercent}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center text-center">
                  {compressedUrl ? (
                    <img 
                      src={compressedUrl} 
                      alt="Compressed" 
                      className="max-h-[260px] max-w-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        ⚡
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Adjust settings above and click <strong>"Generate Compressed Image"</strong> to process.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Row (Download only if generated) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {compressedUrl ? (
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    Download Compressed JPG ({compressedBlob ? formatBytes(compressedBlob.size) : `${targetKB} KB`})
                  </span>
                </button>
              ) : (
                <button
                  onClick={processCompression}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Generate Compressed Image</span>
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

      {/* Bottom 3-Card Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">⚡</div>
          <h3 className="font-bold text-sm text-slate-900">Target KB Calibration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our iterative binary search automatically hits under 50KB or 20KB for strict government portal uploads.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">100% In-Browser Privacy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All compression and EXIF metadata stripping runs right in your browser. No files are ever sent to external clouds.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🎯</div>
          <h3 className="font-bold text-sm text-slate-900">Zero Facial Blur</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Smart bicubic resampling retains crisp facial contours, readable text, and signature strokes without pixelation.
          </p>
        </div>
      </div>

    </div>
  );
};
