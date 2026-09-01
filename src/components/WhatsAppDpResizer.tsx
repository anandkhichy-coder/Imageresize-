import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { loadImage, generateWhatsAppDp, downloadBlob, formatBytes } from '../utils/imageUtils';

export const WhatsAppDpResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<'blur' | 'white' | 'black' | 'gradient'>('blur');
  const [showCircleOverlay, setShowCircleOverlay] = useState<boolean>(true);
  const [outputSize, setOutputSize] = useState<number>(1080);

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

  const processWhatsAppDp = async () => {
    if (!imageEl || !file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await generateWhatsAppDp(imageEl, {
        mode,
        size: outputSize,
      });

      setResultBlob(blob);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      console.error('WhatsApp DP error', err);
      setErrorMsg('Failed to generate WhatsApp DP. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resultBlob, `${base}_whatsapp_full_dp.jpg`);
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

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          WhatsApp Full DP Without Crop Free Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Fit full portrait or landscape photos into 1:1 square profile picture with smooth bokeh blur background
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            📸 Zero Cropping Loss
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
                Click here to upload full size photo
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Any aspect ratio
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => { setMode('blur'); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>✨</span> Aesthetic Blur Background
              </button>
              <button 
                onClick={() => { setMode('white'); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>⚪</span> Clean White Side Borders
              </button>
              <button 
                onClick={() => { setMode('black'); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>⚫</span> Dark Frame Aesthetic
              </button>
              <button 
                onClick={() => { setMode('gradient'); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🌈</span> Modern Soft Gradient
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
            
            {/* DP Backdrop Controls */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Mode Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Padding Background Style:</label>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setMode('blur')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        mode === 'blur' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Blurred Photo
                    </button>
                    <button
                      onClick={() => setMode('white')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        mode === 'white' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Solid White
                    </button>
                    <button
                      onClick={() => setMode('black')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        mode === 'black' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Solid Black
                    </button>
                    <button
                      onClick={() => setMode('gradient')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        mode === 'gradient' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Gradient
                    </button>
                  </div>
                </div>

                {/* Circle Guide Toggle */}
                <button
                  onClick={() => setShowCircleOverlay(!showCircleOverlay)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                    showCircleOverlay ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showCircleOverlay ? 'Hide Circle Cut Preview' : 'Show Circle Cut Preview'}</span>
                </button>

              </div>

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processWhatsAppDp}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>
                    {resultUrl ? '✨ Re-Generate WhatsApp DP' : '✨ Generate WhatsApp DP'}
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

              {/* Square DP Result Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">1:1 Square WhatsApp DP</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    1080 x 1080 px
                  </span>
                </div>
                <div className="p-3 bg-slate-100 min-h-[240px] flex items-center justify-center relative text-center">
                  {resultUrl ? (
                    <div className="relative inline-block">
                      <img 
                        src={resultUrl} 
                        alt="Square DP" 
                        className="max-h-[240px] max-w-full aspect-square object-cover rounded-md shadow-sm"
                      />
                      {showCircleOverlay && (
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/80 shadow-2xs pointer-events-none" />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        ✨
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Choose style above and click <strong>"Generate WhatsApp DP"</strong>.
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
                  <span>Download Full HD WhatsApp DP (1:1 Square)</span>
                </button>
              ) : (
                <button
                  onClick={processWhatsAppDp}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Generate WhatsApp DP</span>
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
          <div className="text-2xl">📸</div>
          <h3 className="font-bold text-sm text-slate-900">Zero Cropping Loss</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Stop losing people from group shots or cutting heads on vertical portraits. Keeps 100% of your photo visible.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">✨</div>
          <h3 className="font-bold text-sm text-slate-900">Gaussian Bokeh Blur</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatically generates a smooth blurred extension of your photo colors to create a modern aesthetic frame.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">100% Private in Browser</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your personal photos and selfies stay on your phone or PC. Zero cloud uploads or data tracking.
          </p>
        </div>
      </div>

    </div>
  );
};
