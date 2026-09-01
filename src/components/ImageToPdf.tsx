import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Check, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatBytes, loadImage } from '../utils/imageUtils';

interface PdfImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<PdfImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: PdfImageItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (!f.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(f);
      try {
        const img = await loadImage(url);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          previewUrl: url,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      } catch (err) {
        console.error(err);
      }
    }
    if (newItems.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WebP).');
      return;
    }
    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setImages(newArr);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const doc = new jsPDF({
        orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: pageSize === 'fit' ? 'a4' : pageSize,
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const item = images[i];

        const pWidth = doc.internal.pageSize.getWidth();
        const pHeight = doc.internal.pageSize.getHeight();

        const marginMm = margin === 'none' ? 0 : margin === 'small' ? 8 : 16;
        const availW = pWidth - marginMm * 2;
        const availH = pHeight - marginMm * 2;

        const imgRatio = item.width / item.height;
        const pageRatio = availW / availH;

        let renderW = availW;
        let renderH = availH;

        if (imgRatio > pageRatio) {
          renderH = availW / imgRatio;
        } else {
          renderW = availH * imgRatio;
        }

        const renderX = marginMm + (availW - renderW) / 2;
        const renderY = marginMm + (availH - renderH) / 2;

        doc.addImage(item.previewUrl, 'JPEG', renderX, renderY, renderW, renderH, undefined, 'FAST');
      }

      doc.save('converted-document.pdf');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to create PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Convert JPG to PDF Free Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Merge single or multiple photos into one clean, high-resolution PDF document
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            📄 Multi-Page Merge
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Upload Zone (Visible when no images) */}
        {images.length === 0 && (
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
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-blue-200 hover:border-blue-600 rounded-2xl p-10 sm:p-14 text-center cursor-pointer bg-[#F8FBFF] hover:bg-[#EFF6FF] transition-all relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <span className="text-5xl mb-3 block select-none group-hover:scale-110 transition-transform">
                📄
              </span>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Click here to upload photos for PDF
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Select multiple photos at once
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Photos
              </span>
            </div>

            {/* Quick Use Cases */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🪪</span> Aadhaar Front + Back
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🎓</span> Marksheets & Degrees
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🧾</span> Invoices & Bills
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📚</span> Notes & Book Pages
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

        {/* Workspace when images are loaded */}
        {images.length > 0 && (
          <div className="space-y-6">
            
            {/* Document Controls Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Page Standard */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Page Format:</label>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setPageSize('a4')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        pageSize === 'a4' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A4 Standard
                    </button>
                    <button
                      onClick={() => setPageSize('letter')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        pageSize === 'letter' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      US Letter
                    </button>
                    <button
                      onClick={() => setPageSize('fit')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        pageSize === 'fit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Fit Image Exactly
                    </button>
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Margins:</label>
                  <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setMargin('small')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        margin === 'small' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Small (8mm)
                    </button>
                    <button
                      onClick={() => setMargin('none')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        margin === 'none' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      No Margin
                    </button>
                  </div>
                </div>

                {/* Add More Photos Button */}
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="add-more-pdf-input"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <label
                    htmlFor="add-more-pdf-input"
                    className="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs mt-4 sm:mt-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Photos</span>
                  </label>
                </div>

              </div>
            </div>

            {/* List of Pages in Order */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>PDF Pages ({images.length} Photos)</span>
                <span className="text-slate-400 font-normal">Drag or use arrows to reorder pages</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {images.map((item, idx) => (
                  <div 
                    key={item.id}
                    className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-14 bg-white border border-slate-200 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={item.previewUrl} alt={`Page ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800">Page {idx + 1}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[120px]">{item.file.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{formatBytes(item.file.size)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeImage(item.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isGenerating ? 'Building PDF Document...' : `Download Combined PDF (${images.length} Pages)`}
                </span>
              </button>

              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Info Grid at Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">📑</div>
          <h3 className="font-bold text-sm text-slate-900">Multi-Page Merging</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Easily combine front and back of Aadhaar, marksheets, or book pages into one sequential PDF file.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">Zero Cloud Uploads</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your sensitive government IDs and bank statements never leave your device. 100% private browser rendering.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">⚡</div>
          <h3 className="font-bold text-sm text-slate-900">High-DPI Clarity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Maintains original camera resolution and vector text clarity without introducing blurry compression artifacts.
          </p>
        </div>
      </div>

    </div>
  );
};
