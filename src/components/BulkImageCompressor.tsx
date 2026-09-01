import React, { useState, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Check, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import JSZip from 'jszip';
import { loadImage, compressImageToTargetKB, downloadBlob, formatBytes } from '../utils/imageUtils';

interface BulkItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export const BulkImageCompressor: React.FC = () => {
  const [items, setItems] = useState<BulkItem[]>([]);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [isCompressingAll, setIsCompressingAll] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: BulkItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (!f.type.startsWith('image/')) continue;
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        originalSize: f.size,
        status: 'pending',
      });
    }
    if (newItems.length === 0) {
      setErrorMsg('Please select valid image files.');
      return;
    }
    setItems((prev) => [...prev, ...newItems]);
  };

  const startBatchCompression = async (presetKB = targetKB) => {
    if (items.length === 0) return;
    setIsCompressingAll(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'processing' } : it))
      );

      try {
        const url = URL.createObjectURL(item.file);
        const img = await loadImage(url);
        const res = await compressImageToTargetKB(img, presetKB, 'image/jpeg');

        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: 'done',
                  compressedBlob: res.blob,
                  compressedSize: res.blob.size,
                }
              : it
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: 'error' } : it))
        );
      }
    }

    setIsCompressingAll(false);
  };

  const downloadSingle = (item: BulkItem) => {
    if (!item.compressedBlob) return;
    const base = item.name.replace(/\.[^/.]+$/, '');
    downloadBlob(item.compressedBlob, `${base}_${targetKB}kb.jpg`);
  };

  const downloadAllAsZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.compressedBlob);
    if (doneItems.length === 0) return;

    const zip = new JSZip();
    doneItems.forEach((it) => {
      const base = it.name.replace(/\.[^/.]+$/, '');
      zip.file(`${base}_${targetKB}kb.jpg`, it.compressedBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `compressed_${targetKB}kb_photos.zip`);
  };

  const handleReset = () => {
    setItems([]);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalOrigSize = items.reduce((acc, it) => acc + it.originalSize, 0);
  const totalCompSize = items.reduce((acc, it) => acc + (it.compressedSize || it.originalSize), 0);
  const totalSavedPercent = totalOrigSize > 0 ? Math.max(0, Math.round(((totalOrigSize - totalCompSize) / totalOrigSize) * 100)) : 0;

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Bulk Image Compressor Free (Batch ZIP Download)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Compress 20+ images simultaneously to under 50KB or 20KB and download in a single ZIP file
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            📦 Batch ZIP Archive
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Upload Zone */}
        {items.length === 0 && (
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
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <span className="text-5xl mb-3 block select-none group-hover:scale-110 transition-transform">
                📦
              </span>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Click here to upload multiple images
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports JPG, PNG, WebP — Select 10, 20 or 50+ photos at once
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose Multiple Photos
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <button 
                onClick={() => { setTargetKB(50); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>📋</span> Bulk Compress to 50KB
              </button>
              <button 
                onClick={() => { setTargetKB(20); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>✍️</span> Bulk Compress to 20KB
              </button>
              <button 
                onClick={() => { setTargetKB(100); fileInputRef.current?.click(); }}
                className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>💼</span> Bulk Compress to 100KB
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

        {/* Workspace when items are selected */}
        {items.length > 0 && (
          <div className="space-y-6">
            
            {/* Target KB & Summary Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Preset Pills */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Size per Photo:</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[20, 50, 100, 200].map((kb) => (
                      <button
                        key={kb}
                        onClick={() => setTargetKB(kb)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          targetKB === kb ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {kb} KB
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch Compress Trigger */}
                <button
                  onClick={() => startBatchCompression(targetKB)}
                  disabled={isCompressingAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCompressingAll ? 'Compressing Batch...' : `⚡ Compress All to ${targetKB}KB`}
                </button>

              </div>
            </div>

            {/* List of Batch Photos */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div 
                  key={item.id}
                  className="border border-slate-200 rounded-xl p-3 bg-white flex items-center justify-between gap-3 shadow-2xs text-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate max-w-[180px] sm:max-w-[280px]">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Original: {formatBytes(item.originalSize)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.status === 'processing' && (
                      <span className="text-blue-600 font-bold animate-pulse">Processing...</span>
                    )}
                    {item.status === 'done' && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                          {item.compressedSize ? formatBytes(item.compressedSize) : `${targetKB}KB`}
                        </span>
                        <button
                          onClick={() => downloadSingle(item)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-1.5 rounded-lg text-xs"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {item.status === 'pending' && (
                      <span className="text-slate-400">Ready</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={downloadAllAsZip}
                disabled={items.filter(it => it.status === 'done').length === 0}
                className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <Download className="w-5 h-5" />
                <span>
                  Download All as ZIP ({items.filter(it => it.status === 'done').length} Photos Ready)
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
          <div className="text-2xl">📦</div>
          <h3 className="font-bold text-sm text-slate-900">One-Click ZIP Bundle</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Archive all compressed files into a single zip download. Keep your computer and download folder organized.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">⚡</div>
          <h3 className="font-bold text-sm text-slate-900">Parallel CPU Workers</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Processes multiple images in rapid asynchronous queues directly in browser memory without system freeze.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">Zero Server Data Transfer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            100% client-side privacy. Batch process full albums without uploading personal media over the web.
          </p>
        </div>
      </div>

    </div>
  );
};
