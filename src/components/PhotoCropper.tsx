import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  AlertCircle,
  Crop
} from 'lucide-react';
import { loadImage, cropImage, downloadBlob, formatBytes } from '../utils/imageUtils';

export const PhotoCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [aspectRatio, setAspectRatio] = useState<number | null>(1); // 1 = 1:1 square
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string>('');
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
    setCroppedBlob(null);
    setCroppedUrl('');
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    try {
      const img = await loadImage(url);
      setImageEl(img);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setCropBox({ x: 0, y: 0, width: w, height: h });
    } catch (err) {
      setErrorMsg('Failed to load image. Please try another file.');
    }
  };

  const applyRatio = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (!imageEl) return;
    const w = imageEl.naturalWidth || imageEl.width;
    const h = imageEl.naturalHeight || imageEl.height;

    if (!ratio) {
      setCropBox({ x: 0, y: 0, width: w, height: h });
      return;
    }

    if (w / h > ratio) {
      const newW = h * ratio;
      setCropBox({ x: (w - newW) / 2, y: 0, width: newW, height: h });
    } else {
      const newH = w / ratio;
      setCropBox({ x: 0, y: (h - newH) / 2, width: w, height: newH });
    }
  };

  const processCrop = async () => {
    if (!imageEl || !file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await cropImage(
        imageEl,
        cropBox,
        rotation,
        flipH,
        flipV
      );

      setCroppedBlob(blob);
      const url = URL.createObjectURL(blob);
      setCroppedUrl(url);
    } catch (err) {
      console.error('Crop failed', err);
      setErrorMsg('Cropping failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!croppedBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(croppedBlob, `${base}_cropped.jpg`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setCroppedBlob(null);
    setCroppedUrl('');
    setErrorMsg(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setPresetRatio = (ratio: number | null) => {
    applyRatio(ratio);
    if (!file) fileInputRef.current?.click();
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Crop & Rotate Photo Free Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Crop pictures with popular preset aspect ratios (1:1, 4:5, 16:9), rotate 90°, and flip with zero loss
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✂️ Lossless Crop
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
                Click here to upload image to crop
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Max 20MB
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Quick Ratio Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => setPresetRatio(1)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🟦</span> 1:1 Square (Instagram / DP)
              </button>
              <button 
                onClick={() => setPresetRatio(4 / 5)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📱</span> 4:5 Portrait Feed
              </button>
              <button 
                onClick={() => setPresetRatio(16 / 9)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📺</span> 16:9 Landscape Video
              </button>
              <button 
                onClick={() => setPresetRatio(35 / 45)}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> 35:45 Passport Ratio
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
            
            {/* Aspect Ratio & Transform Toolbar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Ratio Buttons */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Aspect Ratio:</label>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => applyRatio(1)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        aspectRatio === 1 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      1:1 Square
                    </button>
                    <button
                      onClick={() => applyRatio(4 / 5)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        aspectRatio === 4 / 5 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      4:5 Portrait
                    </button>
                    <button
                      onClick={() => applyRatio(16 / 9)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        aspectRatio === 16 / 9 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      16:9 Landscape
                    </button>
                    <button
                      onClick={() => applyRatio(null)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        aspectRatio === null ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Freeform
                    </button>
                  </div>
                </div>

                {/* Rotate & Flip */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>90°</span>
                  </button>
                  <button
                    onClick={() => setFlipH(!flipH)}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                      flipH ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip H</span>
                  </button>
                  <button
                    onClick={() => setFlipV(!flipV)}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                      flipV ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="Flip Vertical"
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip V</span>
                  </button>
                </div>

              </div>

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processCrop}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Crop className="w-4 h-4" />
                  <span>
                    {croppedUrl ? '✂️ Re-Generate Cropped Photo' : '✂️ Generate Cropped Photo'}
                  </span>
                </button>
              </div>

            </div>

            {/* Side-by-Side Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Original Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span>Original Photo</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[240px] flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-h-[260px] max-w-full object-contain rounded-md"
                  />
                </div>
              </div>

              {/* Cropped Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">Cropped Result</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    {croppedBlob ? formatBytes(croppedBlob.size) : 'Ready'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[240px] flex items-center justify-center text-center">
                  {croppedUrl ? (
                    <img 
                      src={croppedUrl} 
                      alt="Cropped" 
                      className="max-h-[260px] max-w-full object-contain rounded-md shadow-2xs"
                    />
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        ✂️
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Adjust ratio or rotation above and click <strong>"Generate Cropped Photo"</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {croppedUrl ? (
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Cropped Photo</span>
                </button>
              ) : (
                <button
                  onClick={processCrop}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Crop className="w-5 h-5" />
                  <span>Generate Cropped Photo</span>
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
          <div className="text-2xl">✂️</div>
          <h3 className="font-bold text-sm text-slate-900">Standard Aspect Ratios</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            One-tap presets for Instagram square (1:1), portrait feed (4:5), YouTube banner (16:9), and passport format.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔄</div>
          <h3 className="font-bold text-sm text-slate-900">Rotate & Mirror Flip</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Correct sideways orientation or flip mirror selfie shots horizontally without re-encoding quality degradation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">100% In-Browser Privacy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All transformations occur exclusively in client memory. No photos are ever logged or uploaded to cloud servers.
          </p>
        </div>
      </div>

    </div>
  );
};
