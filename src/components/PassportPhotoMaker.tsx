import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Check, 
  Printer, 
  Sliders, 
  AlertCircle 
} from 'lucide-react';
import { PASSPORT_PRESETS } from '../data/toolsData';
import { PassportPreset } from '../types';
import { loadImage, generatePassportGrid, downloadBlob, formatBytes } from '../utils/imageUtils';

export const PassportPhotoMaker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  
  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PASSPORT_PRESETS[0]);
  const [paperFormat, setPaperFormat] = useState<'4x6' | 'A4' | 'single'>('4x6');
  const [copies, setCopies] = useState<number>(8);
  const [customBg, setCustomBg] = useState<string>('#ffffff');
  const [zoom, setZoom] = useState<number>(1);
  const [offsetY, setOffsetY] = useState<number>(0);

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
      setErrorMsg('Failed to load photo. Please try another file.');
    }
  };

  const processPassport = async () => {
    if (!imageEl || !file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = selectedPreset.widthPx;
      canvas.height = selectedPreset.heightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = customBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imgW = imageEl.naturalWidth || imageEl.width;
      const imgH = imageEl.naturalHeight || imageEl.height;

      const baseScale = Math.max(canvas.width / imgW, canvas.height / imgH) * zoom;
      const drawW = imgW * baseScale;
      const drawH = imgH * baseScale;
      const drawX = (canvas.width - drawW) / 2;
      const drawY = (canvas.height - drawH) / 2 + offsetY;

      ctx.drawImage(imageEl, drawX, drawY, drawW, drawH);

      const singleBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.95));
      if (!singleBlob) return;

      const singleImg = await loadImage(singleBlob);
      const gridBlob = await generatePassportGrid(
        singleImg,
        { ...selectedPreset, bgColor: customBg },
        paperFormat,
        copies
      );

      setResultBlob(gridBlob);
      const url = URL.createObjectURL(gridBlob);
      setResultUrl(url);
    } catch (err: any) {
      console.error('Passport photo creation error:', err);
      setErrorMsg('Error generating passport photo. Please check parameters.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resultBlob, `${base}_passport_${paperFormat}.jpg`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setResultBlob(null);
    setResultUrl('');
    setErrorMsg(null);
    setZoom(1);
    setOffsetY(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectPresetQuickly = (presetId: string) => {
    const found = PASSPORT_PRESETS.find(p => p.id === presetId);
    if (found) setSelectedPreset(found);
    if (!file) fileInputRef.current?.click();
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Passport Size Photo Maker Online Free (35x45mm)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Create official Indian passport photos, US 2x2 visa photos & printable 4x6 sheets instantly
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🖨️ Printable 4x6 / A4 Sheet
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
                Click here to upload portrait photo
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Max 20MB
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Quick Country / Size Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => selectPresetQuickly('india-passport')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🇮🇳</span> India Passport (35x45mm)
              </button>
              <button 
                onClick={() => selectPresetQuickly('us-visa')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🇺🇸</span> US Visa (2x2 inch)
              </button>
              <button 
                onClick={() => selectPresetQuickly('pan-card')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🪪</span> PAN Card (25x35mm)
              </button>
              <button 
                onClick={() => selectPresetQuickly('stamp-size')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📄</span> Stamp Size (20x25mm)
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="py-6 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 font-bold text-slate-800 text-sm sm:text-base">
              <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span>Rendering Passport Photo Sheet...</span>
            </div>
          </div>
        )}

        {/* Error Box */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm text-red-700 flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Workspace When File is Loaded */}
        {file && !isProcessing && (
          <div className="space-y-6">
            
            {/* Presets & Paper Controls */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              
              {/* Preset Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Country & Document Standard
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PASSPORT_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPreset(p)}
                      className={`p-2.5 text-left rounded-xl border transition-all ${
                        selectedPreset.id === p.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{p.title}</div>
                      <div className={`text-[11px] ${selectedPreset.id === p.id ? 'text-blue-100' : 'text-slate-400'}`}>
                        {p.widthMm} x {p.heightMm} mm
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout / Sheet Options */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">Print Layout:</span>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setPaperFormat('4x6')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        paperFormat === '4x6' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      4x6 Print Sheet (8 Photos)
                    </button>
                    <button
                      onClick={() => setPaperFormat('A4')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        paperFormat === 'A4' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A4 Full Sheet (32 Photos)
                    </button>
                    <button
                      onClick={() => setPaperFormat('single')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        paperFormat === 'single' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Single Digital Photo
                    </button>
                  </div>
                </div>

                {/* Face Zoom & Offset */}
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block">Face Zoom:</label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.8"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block">Vertical Align:</label>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      step="2"
                      value={offsetY}
                      onChange={(e) => setOffsetY(parseInt(e.target.value))}
                      className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Action Button */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={processPassport}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>
                    {resultUrl ? '📸 Re-Generate Passport Photo' : '📸 Generate Passport Photo'}
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

              {/* Passport Result Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold">{selectedPreset.name}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    {paperFormat === '4x6' ? '8 Photos / 4x6"' : paperFormat === 'A4' ? '32 Photos / A4' : 'Single Crop'}
                  </span>
                </div>
                <div className="p-3 bg-slate-100 min-h-[240px] flex items-center justify-center text-center">
                  {resultUrl ? (
                    <img 
                      src={resultUrl} 
                      alt="Passport Grid" 
                      className="max-h-[260px] max-w-full object-contain rounded-md shadow-md border border-slate-300"
                    />
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        📸
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Choose country & sheet format above and click <strong>"Generate Passport Photo"</strong>.
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
                    Download {paperFormat === 'single' ? 'Passport Photo (35x45mm)' : `Printable ${paperFormat} Photo Sheet`}
                  </span>
                </button>
              ) : (
                <button
                  onClick={processPassport}
                  className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Generate Passport Photo</span>
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
          <h3 className="font-bold text-sm text-slate-900">Standard 35x45mm Ratio</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Exact biometric compliance for Indian Passport Seva Kendra, OCI, and Schengen visa requirements.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🖨️</div>
          <h3 className="font-bold text-sm text-slate-900">Studio 4x6 & A4 Grid</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download 8 or 32 photos on standard glossy photo paper. Save ₹100+ on local photography studio printing.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">✂️</div>
          <h3 className="font-bold text-sm text-slate-900">Cutting Guide Lines</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Includes subtle 1px border lines to easily cut clean, straight-edged passport photos with ordinary scissors.
          </p>
        </div>
      </div>

    </div>
  );
};
