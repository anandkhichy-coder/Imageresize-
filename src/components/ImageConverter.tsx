import React, { useState, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle,
  ArrowRightLeft
} from 'lucide-react';
import { loadImage, downloadBlob, formatBytes } from '../utils/imageUtils';

export const ImageConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(95);

  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }
    setErrorMsg(null);
    setFile(selectedFile);
    setConvertedBlob(null);
    setConvertedUrl('');
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    try {
      const img = await loadImage(url);
      setImageEl(img);
    } catch (err) {
      setErrorMsg('Failed to load image. Please try another file.');
    }
  };

  const processConvert = async () => {
    if (!imageEl || !file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imageEl.naturalWidth || imageEl.width;
      canvas.height = imageEl.naturalHeight || imageEl.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(imageEl, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, targetFormat, quality / 100);
      });

      if (blob) {
        setConvertedBlob(blob);
        setConvertedUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Conversion error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormatChange = (fmt: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setTargetFormat(fmt);
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/webp' ? 'webp' : 'png';
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(convertedBlob, `${base}_converted.${ext}`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setConvertedBlob(null);
    setConvertedUrl('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setPresetFormat = (fmt: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setTargetFormat(fmt);
    if (!file) fileInputRef.current?.click();
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Image Format Converter Free Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Convert PNG to JPG, JPG to PNG, or WebP to JPG instantly in your browser with zero quality degradation
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ⚡ Universal Compatibility
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
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <span className="text-5xl mb-3 block select-none group-hover:scale-110 transition-transform">
                🖼️
              </span>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Click here to upload image to convert
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP, GIF, BMP — Max 20MB
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Quick Conversion Targets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => setPresetFormat('image/jpeg')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🔄</span> Convert to JPG / JPEG
              </button>
              <button 
                onClick={() => setPresetFormat('image/png')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🔄</span> Convert to PNG (Transparent)
              </button>
              <button 
                onClick={() => setPresetFormat('image/webp')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🚀</span> Convert to Next-Gen WebP
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
            
            {/* Format Switcher */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Format:</label>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => handleFormatChange('image/jpeg')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                        targetFormat === 'image/jpeg' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      JPG / JPEG
                    </button>
                    <button
                      onClick={() => handleFormatChange('image/png')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                        targetFormat === 'image/png' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      PNG (Lossless)
                    </button>
                    <button
                      onClick={() => handleFormatChange('image/webp')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                        targetFormat === 'image/webp' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      WebP (Next-Gen)
                    </button>
                  </div>
                </div>

                {targetFormat !== 'image/png' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Quality ({quality}%):</label>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

              </div>

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processConvert}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>
                    {convertedUrl ? `🔄 Re-Convert to ${targetFormat.split('/')[1]?.toUpperCase()}` : `🔄 Convert to ${targetFormat.split('/')[1]?.toUpperCase()}`}
                  </span>
                </button>
              </div>

            </div>

            {/* Side-by-Side Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Original Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span>Source ({file.type.split('/')[1]?.toUpperCase() || 'IMAGE'})</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Source" 
                    className="max-h-[260px] max-w-full object-contain rounded-md"
                  />
                </div>
              </div>

              {/* Converted Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">
                    Converted to {targetFormat.split('/')[1]?.toUpperCase()}
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    {convertedBlob ? formatBytes(convertedBlob.size) : 'Ready'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/50 min-h-[220px] flex items-center justify-center text-center">
                  {convertedUrl ? (
                    <img 
                      src={convertedUrl} 
                      alt="Converted" 
                      className="max-h-[260px] max-w-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        🔄
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Select target format above and click <strong>"Convert to {targetFormat.split('/')[1]?.toUpperCase()}"</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {convertedUrl ? (
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    Download {targetFormat === 'image/jpeg' ? 'JPG' : targetFormat === 'image/png' ? 'PNG' : 'WebP'} Image
                  </span>
                </button>
              ) : (
                <button
                  onClick={processConvert}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Convert Image</span>
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
          <div className="text-2xl">🔄</div>
          <h3 className="font-bold text-sm text-slate-900">Lossless & Lossy Options</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose lossless PNG for graphic art and signatures, or high-compression JPG/WebP for photography.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">⚡</div>
          <h3 className="font-bold text-sm text-slate-900">Instant In-Memory Render</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Runs at hardware acceleration speed with zero server queuing. Convert large multi-megapixel photos in milliseconds.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">100% Private Offline</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All format decoding and encoding is done in your browser sandbox without ever uploading data across the internet.
          </p>
        </div>
      </div>

    </div>
  );
};
