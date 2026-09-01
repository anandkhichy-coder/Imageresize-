import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Lock, 
  Unlock, 
  AlertCircle 
} from 'lucide-react';
import { loadImage, resizeImage, downloadBlob, formatBytes } from '../utils/imageUtils';

export const PhotoResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  // Dimensions state
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Output
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string>('');
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
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    try {
      const img = await loadImage(url);
      setImageEl(img);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setOriginalWidth(w);
      setOriginalHeight(h);
      setWidth(w);
      setHeight(h);
      setAspectRatio(w / h);
    } catch (err) {
      setErrorMsg('Failed to load image. Please try another file.');
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspectRatio && aspectRatio > 0) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspectRatio && aspectRatio > 0) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    if (originalWidth > 0) {
      setAspectRatio(w / h);
    }
    if (!file) fileInputRef.current?.click();
  };

  const processResize = async () => {
    if (!imageEl || !file || width <= 0 || height <= 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await resizeImage(
        imageEl,
        width,
        height,
        format,
        0.92
      );

      setResizedBlob(blob);
      const url = URL.createObjectURL(blob);
      setResizedUrl(url);
    } catch (err) {
      console.error('Resize failed', err);
      setErrorMsg('Resize failed. Please check dimensions.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedBlob || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resizedBlob, `${base}_${width}x${height}.${ext}`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setResizedBlob(null);
    setResizedUrl('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resize Image Dimensions Free Online (Pixels & CM)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Resize photos to exact width and height with pixel-perfect aspect ratio lock
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            📐 Exact Pixel Accuracy
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
                Click here to upload image to resize
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Max 20MB
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Quick Dimension Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => applyPreset(1920, 1080)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🖥️</span> 1920 x 1080 (Full HD)
              </button>
              <button 
                onClick={() => applyPreset(1080, 1080)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📸</span> 1080 x 1080 (Square DP)
              </button>
              <button 
                onClick={() => applyPreset(1200, 630)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🔗</span> 1200 x 630 (Social Banner)
              </button>
              <button 
                onClick={() => applyPreset(200, 230)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> 200 x 230 (SSC Form)
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

        {/* Workspace when file is loaded */}
        {file && (
          <div className="space-y-6">
            
            {/* Dimension Inputs Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Inputs */}
                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Width (px):</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
                      className="w-28 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`mt-4 p-2 rounded-lg border transition-all ${
                      lockAspectRatio ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-400'
                    }`}
                    title={lockAspectRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                  >
                    {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Height (px):</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
                      className="w-28 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                </div>

                {/* Format Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Export Format:</label>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setFormat('image/jpeg')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        format === 'image/jpeg' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      JPG
                    </button>
                    <button
                      onClick={() => setFormat('image/png')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        format === 'image/png' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => setFormat('image/webp')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        format === 'image/webp' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      WEBP
                    </button>
                  </div>
                </div>

              </div>

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processResize}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>
                    {resizedUrl ? '📐 Re-Generate Resized Image' : '📐 Generate Resized Image'}
                  </span>
                </button>
              </div>

            </div>

            {/* Side-by-Side Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Original Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span>Original Dimensions</span>
                  <span>{originalWidth} x {originalHeight} px</span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-h-[260px] max-w-full object-contain rounded-md"
                  />
                </div>
              </div>

              {/* Resized Result Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">Resized Dimensions</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    {resizedUrl ? `${width} x ${height} px` : 'Ready to Resize'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center text-center">
                  {resizedUrl ? (
                    <img 
                      src={resizedUrl} 
                      alt="Resized" 
                      className="max-h-[260px] max-w-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        📐
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Set target dimensions above and click <strong>"Generate Resized Image"</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {resizedUrl ? (
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    Download Resized Image ({width} x {height} px)
                  </span>
                </button>
              ) : (
                <button
                  onClick={processResize}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Generate Resized Image</span>
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
          <div className="text-2xl">📐</div>
          <h3 className="font-bold text-sm text-slate-900">Pixel-Perfect Scaling</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            High-fidelity bicubic interpolation prevents jagged diagonal lines and preserves delicate image details.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">100% Client-Side Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All resizing processes instantly in your local browser memory with zero waiting queues or server uploads.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">⚡</div>
          <h3 className="font-bold text-sm text-slate-900">Custom & Preset Ratios</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Lock aspect ratio or set custom widths and heights for social media avatars, web banners, and form uploads.
          </p>
        </div>
      </div>

    </div>
  );
};
