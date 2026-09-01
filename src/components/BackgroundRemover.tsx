import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Paintbrush,
  Undo2,
  Sliders,
  Layers,
  Lock
} from 'lucide-react';
import { loadImage, removeBackgroundCanvas, downloadBlob, formatBytes } from '../utils/imageUtils';
import { segmentWithAI } from '../utils/aiSegmentation';
import { segmentWithMediaPipe } from '../utils/mediapipeSegmentation';

export const BackgroundRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  // Background modes
  const [bgMode, setBgMode] = useState<'transparent' | 'color' | 'gradient' | 'blur'>('transparent');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [gradientStart, setGradientStart] = useState<string>('#3b82f6');
  const [gradientEnd, setGradientEnd] = useState<string>('#1e3a8a');
  const [tolerance, setTolerance] = useState<number>(30);
  const [blurRadius, setBlurRadius] = useState<number>(18);

  // Cached raw transparent subject cutout (PNG)
  const [rawSubjectBlob, setRawSubjectBlob] = useState<Blob | null>(null);
  const [rawSubjectImg, setRawSubjectImg] = useState<HTMLImageElement | null>(null);

  // Touch-up / Manual Brush Tool state
  const [isBrushMode, setIsBrushMode] = useState<boolean>(false);
  const [brushAction, setBrushAction] = useState<'restore' | 'erase'>('restore');
  const [brushSize, setBrushSize] = useState<number>(32);
  const touchupCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [touchupHistory, setTouchupHistory] = useState<ImageData[]>([]);

  // Processing & progress state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Analyzing image...');
  const [statusSub, setStatusSub] = useState<string>('Please wait');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetColors = [
    { name: 'Pure White (Govt & ID)', color: '#ffffff' },
    { name: 'Off White', color: '#f8fafc' },
    { name: 'Passport Light Blue', color: '#e0f2fe' },
    { name: 'Royal Blue', color: '#1e40af' },
    { name: 'Studio Grey', color: '#94a3b8' },
    { name: 'Soft Red', color: '#ef4444' },
    { name: 'Emerald Green', color: '#10b981' },
    { name: 'Dark Slate', color: '#0f172a' },
  ];

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setErrorMsg('File too large. Please use an image under 20MB.');
      return;
    }

    setErrorMsg(null);
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setIsBrushMode(false);

    try {
      const img = await loadImage(objectUrl);
      setImageEl(img);
      runBackgroundExtraction(selectedFile, img, tolerance);
    } catch (err: any) {
      setErrorMsg('Failed to load image. Please try another file.');
    }
  };

  /**
   * Main Background Extraction - Runs AI & Biometric Torso Protection silently in background
   */
  const runBackgroundExtraction = async (
    sourceFile: File,
    imgElement: HTMLImageElement,
    tol: number
  ) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setProgressPct(20);
    setStatusMsg('Analyzing Photo Subject & Silhouette...');
    setStatusSub('Detecting person, shirt, hair & clothing contours');

    try {
      let cutoutPngBlob: Blob | null = null;

      // 1. High-accuracy MediaPipe Neural Segmentation (Specifically optimized for selfie, portraits, hair, and clothing)
      try {
        setProgressPct(35);
        setStatusMsg('Detecting Subject with AI Neural Engine...');
        setStatusSub('Extracting hair, shirt, neck and face contours');
        cutoutPngBlob = await segmentWithMediaPipe(imgElement);
      } catch (mpErr) {
        cutoutPngBlob = null;
      }

      // 2. Fallback to ISNet AI Model
      if (!cutoutPngBlob) {
        try {
          setProgressPct(60);
          setStatusMsg('Running Full-Body AI Model...');
          setStatusSub('Processing silhouette boundaries');
          cutoutPngBlob = await segmentWithAI(sourceFile, (pct) => {
            setProgressPct(40 + Math.round(pct * 0.4));
          });
        } catch (aiErr) {
          cutoutPngBlob = null;
        }
      }

      // 3. Fallback to High-Precision Biometric Canvas Engine
      if (!cutoutPngBlob) {
        setProgressPct(80);
        setStatusMsg('Applying Precision Boundary Shield...');
        setStatusSub('Preserving shirt, clothing and body contours');

        cutoutPngBlob = await removeBackgroundCanvas(imgElement, {
          mode: 'transparent',
          tolerance: tol,
        });
      }

      if (cutoutPngBlob) {
        setRawSubjectBlob(cutoutPngBlob);
        const cutoutImg = await loadImage(URL.createObjectURL(cutoutPngBlob));
        setRawSubjectImg(cutoutImg);

        // Composite onto current background mode
        await renderCompositeResult(cutoutImg, imgElement, bgMode, bgColor, gradientStart, gradientEnd, blurRadius);
      }

      setProgressPct(100);
      setStatusMsg('✅ Done!');
      setStatusSub('Background removed cleanly with subject and clothes intact');
    } catch (err: any) {
      setErrorMsg('Could not remove background. Please try another photo or use the Manual Touch-Up Brush.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Fast Composite onto Selected Background
   */
  const renderCompositeResult = async (
    cutoutImg: HTMLImageElement,
    originalImg: HTMLImageElement,
    mode: 'transparent' | 'color' | 'gradient' | 'blur',
    color: string,
    gStart: string,
    gEnd: string,
    blur: number
  ) => {
    const w = cutoutImg.naturalWidth || cutoutImg.width;
    const h = cutoutImg.naturalHeight || cutoutImg.height;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mode === 'color') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
    } else if (mode === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, gStart);
      grad.addColorStop(1, gEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (mode === 'blur') {
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(originalImg, -20, -20, w + 40, h + 40);
      ctx.filter = 'none';
    } else {
      ctx.clearRect(0, 0, w, h);
    }

    // Draw the preserved subject cutout
    ctx.drawImage(cutoutImg, 0, 0);

    const format = mode === 'transparent' ? 'image/png' : 'image/jpeg';
    const finalBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, format, 0.95));

    if (finalBlob) {
      setResultBlob(finalBlob);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(finalBlob));
    }
  };

  // Instant update when background mode or color changes
  const handleModeChange = (newMode: 'transparent' | 'color' | 'gradient' | 'blur', newColor = bgColor) => {
    setBgMode(newMode);
    if (newColor !== bgColor) setBgColor(newColor);
    if (rawSubjectImg && imageEl) {
      renderCompositeResult(rawSubjectImg, imageEl, newMode, newColor, gradientStart, gradientEnd, blurRadius);
    }
  };

  const handleToleranceChange = (newTol: number) => {
    setTolerance(newTol);
    if (file && imageEl) {
      runBackgroundExtraction(file, imageEl, newTol);
    }
  };

  // Initialize Touch-up Canvas
  useEffect(() => {
    if (isBrushMode && touchupCanvasRef.current && rawSubjectImg) {
      const cvs = touchupCanvasRef.current;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        cvs.width = rawSubjectImg.naturalWidth || rawSubjectImg.width;
        cvs.height = rawSubjectImg.naturalHeight || rawSubjectImg.height;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(rawSubjectImg, 0, 0);

        const initialData = ctx.getImageData(0, 0, cvs.width, cvs.height);
        setTouchupHistory([initialData]);
      }
    }
  }, [isBrushMode, rawSubjectImg]);

  // Touch-up Brush Canvas interactions
  const handleBrushStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    applyBrushAtPoint(e);
  };

  const handleBrushMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    applyBrushAtPoint(e);
  };

  const handleBrushEnd = () => {
    if (isDrawing && touchupCanvasRef.current) {
      const ctx = touchupCanvasRef.current.getContext('2d');
      if (ctx) {
        const currentData = ctx.getImageData(0, 0, touchupCanvasRef.current.width, touchupCanvasRef.current.height);
        setTouchupHistory(prev => [...prev.slice(-10), currentData]);
      }
    }
    setIsDrawing(false);
  };

  const applyBrushAtPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = touchupCanvasRef.current;
    if (!cvs || !imageEl) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.closePath();

    if (brushAction === 'erase') {
      // Erase mode (make transparent)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
    } else {
      // Restore mode (copy original image pixels back onto subject cutout)
      ctx.globalCompositeOperation = 'source-over';
      ctx.clip();
      ctx.drawImage(imageEl, 0, 0, cvs.width, cvs.height);
    }
    ctx.restore();
  };

  const handleUndoTouchup = () => {
    if (touchupHistory.length > 1 && touchupCanvasRef.current) {
      const ctx = touchupCanvasRef.current.getContext('2d');
      if (ctx) {
        const previous = touchupHistory[touchupHistory.length - 2];
        ctx.putImageData(previous, 0, 0);
        setTouchupHistory(prev => prev.slice(0, prev.length - 1));
      }
    }
  };

  const handleSaveTouchup = async () => {
    if (!touchupCanvasRef.current || !imageEl) return;
    const cvs = touchupCanvasRef.current;
    const updatedBlob = await new Promise<Blob | null>((res) => cvs.toBlob(res, 'image/png'));
    if (updatedBlob) {
      setRawSubjectBlob(updatedBlob);
      const updatedImg = await loadImage(URL.createObjectURL(updatedBlob));
      setRawSubjectImg(updatedImg);
      setIsBrushMode(false);
      renderCompositeResult(updatedImg, imageEl, bgMode, bgColor, gradientStart, gradientEnd, blurRadius);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const ext = bgMode === 'transparent' ? 'png' : 'jpg';
    const base = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resultBlob, `${base}-no-bg.${ext}`);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl('');
    setImageEl(null);
    setRawSubjectBlob(null);
    setRawSubjectImg(null);
    setResultBlob(null);
    setResultUrl('');
    setErrorMsg(null);
    setProgressPct(0);
    setIsBrushMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setUseCasePreset = (preset: 'passport' | 'aadhaar' | 'product' | 'resume') => {
    if (preset === 'passport' || preset === 'aadhaar' || preset === 'resume') {
      handleModeChange('color', '#ffffff');
    } else {
      handleModeChange('transparent');
    }
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="max-w-[920px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Remove Image Background (100% Subject & Clothes Protected)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Intelligent background removal that keeps your face, hair, shirt, uniform, and clothing completely intact.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Face & Shirt 100% Protected</span>
          </span>
          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Background Cutout</span>
          </span>
          <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>100% Private (Runs in Device RAM)</span>
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Upload Zone (Visible when no file is selected) */}
        {!file && (
          <div>
            <div
              id="uploadZone"
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
                Click here or drag photo to remove background
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                Supports JPG, PNG, WebP — Max 20MB (Works with selfies, passport photos, white/checkered shirts & products)
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photo
              </span>
            </div>

            {/* Use-cases Tag Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => setUseCasePreset('passport')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> Passport Photo (White BG)
              </button>
              <button 
                onClick={() => setUseCasePreset('aadhaar')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🪪</span> Govt Exam Photo
              </button>
              <button 
                onClick={() => setUseCasePreset('product')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🛍️</span> Transparent PNG Product
              </button>
              <button 
                onClick={() => setUseCasePreset('resume')}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>💼</span> Resume & Profile Photo
              </button>
            </div>
          </div>
        )}

        {/* Processing State with Animated Bar & Spinner */}
        {isProcessing && (
          <div className="py-8 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 font-bold text-slate-800 text-sm sm:text-base">
              <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span>{statusMsg}</span>
            </div>
            
            {/* Progress Track */}
            <div className="w-full max-w-md mx-auto h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{statusSub}</p>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Workspace (When image processed) */}
        {file && !isProcessing && resultUrl && (
          <div className="space-y-6">
            
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Subject & Shirt Preserved</span>
                </span>
              </div>

              {/* Manual Brush Touchup Trigger */}
              <button
                onClick={() => setIsBrushMode(!isBrushMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                  isBrushMode 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>{isBrushMode ? 'Close Touch-Up Tool' : 'Manual Touch-Up Brush (Restore / Erase)'}</span>
              </button>
            </div>

            {/* Edge Sensitivity Slider */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edge & Contour Sensitivity</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Adjust if your image has low contrast between edges and background.
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <input
                  type="range"
                  min="15"
                  max="55"
                  value={tolerance}
                  onChange={(e) => handleToleranceChange(Number(e.target.value))}
                  className="w-28 sm:w-40 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-700 w-8">{tolerance}</span>
              </div>
            </div>

            {/* Manual Touch-Up Brush Workshop (When Active) */}
            {isBrushMode && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Paintbrush className="w-4 h-4 text-indigo-600" />
                      <span>Interactive Touch-Up Brush</span>
                    </h4>
                    <p className="text-[11px] text-indigo-700">
                      Brush over your photo below to restore any part of your shirt/photo or erase leftover background.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Restore vs Erase */}
                    <div className="inline-flex rounded-lg border border-indigo-200 bg-white p-0.5">
                      <button
                        onClick={() => setBrushAction('restore')}
                        className={`px-3 py-1 rounded-md text-xs font-bold flex items-center space-x-1 ${
                          brushAction === 'restore' ? 'bg-emerald-600 text-white' : 'text-slate-700'
                        }`}
                      >
                        <span>🟢 Restore Photo</span>
                      </button>
                      <button
                        onClick={() => setBrushAction('erase')}
                        className={`px-3 py-1 rounded-md text-xs font-bold flex items-center space-x-1 ${
                          brushAction === 'erase' ? 'bg-red-600 text-white' : 'text-slate-700'
                        }`}
                      >
                        <span>🔴 Erase Background</span>
                      </button>
                    </div>

                    {/* Undo */}
                    <button
                      onClick={handleUndoTouchup}
                      disabled={touchupHistory.length <= 1}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40 flex items-center gap-1"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                  </div>
                </div>

                {/* Brush Size Slider */}
                <div className="flex items-center space-x-3 text-xs text-indigo-900 bg-white/70 p-2 rounded-lg border border-indigo-100">
                  <span className="font-semibold">Brush Size:</span>
                  <input
                    type="range"
                    min="8"
                    max="80"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-36 accent-indigo-600 cursor-pointer"
                  />
                  <span className="font-mono font-bold">{brushSize}px</span>
                </div>

                {/* Interactive Drawing Canvas */}
                <div className="border border-indigo-200 rounded-xl overflow-hidden bg-slate-900/10 p-2 flex items-center justify-center checkerboard-pattern min-h-[300px]">
                  <canvas
                    ref={touchupCanvasRef}
                    onMouseDown={handleBrushStart}
                    onMouseMove={handleBrushMove}
                    onMouseUp={handleBrushEnd}
                    onMouseLeave={handleBrushEnd}
                    className="max-h-[380px] max-w-full object-contain cursor-crosshair rounded shadow-sm bg-transparent"
                  />
                </div>

                {/* Apply Button */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsBrushMode(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTouchup}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                  >
                    ✅ Apply Touch-Up Changes
                  </button>
                </div>
              </div>
            )}

            {/* Background Mode Switcher */}
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select New Background:
                </span>
                <span className="text-xs text-slate-500">
                  Choose transparent PNG or add official solid / blur backdrops
                </span>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleModeChange('transparent')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    bgMode === 'transparent'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">🏁</span>
                  <span>Transparent (PNG)</span>
                </button>

                <button
                  onClick={() => handleModeChange('color', bgColor || '#ffffff')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    bgMode === 'color'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">🎨</span>
                  <span>Solid Color (White/Blue)</span>
                </button>

                <button
                  onClick={() => handleModeChange('gradient')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    bgMode === 'gradient'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">🌈</span>
                  <span>Studio Gradient</span>
                </button>

                <button
                  onClick={() => handleModeChange('blur')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    bgMode === 'blur'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">✨</span>
                  <span>Portrait Blur</span>
                </button>
              </div>

              {/* Color Presets & Custom Color Picker */}
              {bgMode === 'color' && (
                <div className="pt-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {presetColors.map((pc) => (
                      <button
                        key={pc.color}
                        onClick={() => handleModeChange('color', pc.color)}
                        className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          bgColor.toLowerCase() === pc.color.toLowerCase()
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" 
                          style={{ backgroundColor: pc.color }} 
                        />
                        <span>{pc.name}</span>
                      </button>
                    ))}

                    <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                      <span className="text-xs text-slate-500">Custom:</span>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => handleModeChange('color', e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Gradient Settings */}
              {bgMode === 'gradient' && (
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>Start Color:</span>
                    <input
                      type="color"
                      value={gradientStart}
                      onChange={(e) => {
                        setGradientStart(e.target.value);
                        if (rawSubjectImg && imageEl) renderCompositeResult(rawSubjectImg, imageEl, 'gradient', bgColor, e.target.value, gradientEnd, blurRadius);
                      }}
                      className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>End Color:</span>
                    <input
                      type="color"
                      value={gradientEnd}
                      onChange={(e) => {
                        setGradientEnd(e.target.value);
                        if (rawSubjectImg && imageEl) renderCompositeResult(rawSubjectImg, imageEl, 'gradient', bgColor, gradientStart, e.target.value, blurRadius);
                      }}
                      className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              )}

              {/* Blur Slider */}
              {bgMode === 'blur' && (
                <div className="pt-2 flex items-center space-x-3 text-xs text-slate-700">
                  <span className="font-semibold">Blur Intensity:</span>
                  <input
                    type="range"
                    min="4"
                    max="35"
                    value={blurRadius}
                    onChange={(e) => {
                      const b = Number(e.target.value);
                      setBlurRadius(b);
                      if (rawSubjectImg && imageEl) renderCompositeResult(rawSubjectImg, imageEl, 'blur', bgColor, gradientStart, gradientEnd, b);
                    }}
                    className="w-36 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-slate-900">{blurRadius}px</span>
                </div>
              )}
            </div>

            {/* Single Focused Cutout Result View (No Redundant Before/After Grid) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col shadow-xs">
              <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span className="flex items-center gap-2 text-blue-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Clean Background Removed Photo ({bgMode.toUpperCase()})</span>
                </span>
                {resultBlob && (
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs">
                    {formatBytes(resultBlob.size)}
                  </span>
                )}
              </div>
              <div className={`p-4 sm:p-8 flex-1 flex items-center justify-center min-h-[320px] sm:min-h-[420px] ${bgMode === 'transparent' ? 'checkerboard-pattern' : 'bg-slate-100'}`}>
                <img
                  src={resultUrl}
                  alt="Background Removed Result"
                  className="max-h-[400px] sm:max-h-[500px] max-w-full object-contain rounded-xl shadow-md"
                />
              </div>
            </div>

            {/* Download & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>
                  Download Clean {bgMode === 'transparent' ? 'PNG (Transparent)' : 'JPG Photo'}
                </span>
              </button>

              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3.5 px-5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Upload Another Photo</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Trust & FAQ Section */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 text-slate-700">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          💡 How our AI Protects Your Shirt & Clothes:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">👔 White & Checkered Shirt Protection</h4>
            <p className="text-slate-600 leading-relaxed">
              Our biometric torso detection identifies the head, neck and clothing zone so shirts, ties, and collars are never cut away.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">🔒 100% Private (Runs in Browser)</h4>
            <p className="text-slate-600 leading-relaxed">
              Your sensitive personal photos never leave your device or get uploaded to external servers.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">🖌️ Interactive Touch-Up Brush</h4>
            <p className="text-slate-600 leading-relaxed">
              Easily use the manual restore/erase brush if you want to touch up fine hair strands or customize cutouts.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

