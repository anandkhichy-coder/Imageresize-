import React, { useState, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { convertHeicToJpg, downloadBlob, formatBytes } from '../utils/imageUtils';

export const HeicToJpgConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedItems, setConvertedItems] = useState<{ name: string; blob: Blob; url: string; size: number; origSize: number }[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | File[]) => {
    const list = Array.from(fileList);
    if (list.length === 0) return;
    
    setErrorMsg(null);
    setFiles(list);
    setConvertedItems([]);
  };

  const startConversion = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setErrorMsg(null);

    const results: { name: string; blob: Blob; url: string; size: number; origSize: number }[] = [];

    for (const f of files) {
      try {
        const blob = await convertHeicToJpg(f, outputFormat);
        const url = URL.createObjectURL(blob);
        const ext = outputFormat === 'image/jpeg' ? 'jpg' : 'png';
        const base = f.name.replace(/\.[^/.]+$/, '');
        results.push({
          name: `${base}.${ext}`,
          blob,
          url,
          size: blob.size,
          origSize: f.size,
        });
      } catch (err: any) {
        console.error('HEIC conversion failed for file:', f.name, err);
      }
    }

    if (results.length === 0) {
      setErrorMsg('Could not convert selected files. Please ensure you uploaded valid .heic or image files.');
    }

    setConvertedItems(results);
    setIsConverting(false);
  };

  const handleDownloadSingle = (item: { name: string; blob: Blob }) => {
    downloadBlob(item.blob, item.name);
  };

  const handleDownloadAll = () => {
    convertedItems.forEach((item) => {
      downloadBlob(item.blob, item.name);
    });
  };

  const handleReset = () => {
    setFiles([]);
    setConvertedItems([]);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Convert HEIC to JPG Free Online (iPhone Photos)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Turn Apple iPhone .HEIC / .HEIF live photos into universal JPG or PNG format instantly in your browser
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ 100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            🔒 No Server Upload
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            📱 iPhone & iPad Ready
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Upload Zone */}
        {files.length === 0 && !isConverting && (
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
                accept=".heic,.heif,image/heic,image/heif,image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <span className="text-5xl mb-3 block select-none group-hover:scale-110 transition-transform">
                📱
              </span>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Click here to upload iPhone HEIC photos
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                Supports .HEIC, .HEIF, and Apple Camera roll files
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors">
                Choose iPhone Photos
              </span>
            </div>
          </div>
        )}

        {/* Selected Files Preview & Controls (Before Conversion) */}
        {files.length > 0 && convertedItems.length === 0 && !isConverting && (
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Convert To:</label>
                <div className="flex items-center gap-1 bg-white p-1 border border-slate-200 rounded-lg">
                  <button
                    onClick={() => setOutputFormat('image/jpeg')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                      outputFormat === 'image/jpeg' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    JPG (Universal)
                  </button>
                  <button
                    onClick={() => setOutputFormat('image/png')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                      outputFormat === 'image/png' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    PNG (Lossless)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={startConversion}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>📱 Generate Converted Photos ({files.length})</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Selected Photos ({files.length})
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                {files.map((f, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold truncate max-w-[280px]">{f.name}</span>
                    <span className="text-slate-400 font-mono">{formatBytes(f.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Converting State */}
        {isConverting && (
          <div className="py-6 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 font-bold text-slate-800 text-sm sm:text-base">
              <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span>Decoding iPhone HEIC in Browser Memory...</span>
            </div>
            <p className="text-xs text-slate-500">Extracting color profiles & EXIF data</p>
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

        {/* Workspace when converted */}
        {convertedItems.length > 0 && !isConverting && (
          <div className="space-y-6">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Converted Photos ({convertedItems.length})
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                100% Ready for Windows / Android
              </span>
            </div>

            {/* List of Converted Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {convertedItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="border border-slate-200 rounded-xl p-3 bg-white flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {formatBytes(item.size)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadSingle(item)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg text-xs font-bold transition-colors shrink-0"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownloadAll}
                className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download All Converted JPG Photos</span>
              </button>

              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Convert More Photos</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Info Grid at Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">📱</div>
          <h3 className="font-bold text-sm text-slate-900">Apple Format Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Natively decode HEIC files produced by iPhone 7 through iPhone 16 Pro Max without installing software.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">💻</div>
          <h3 className="font-bold text-sm text-slate-900">Windows & Web Compatible</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Produces standard JPEG pictures that open effortlessly on Windows PCs, Android phones, and online portals.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="text-2xl">🔒</div>
          <h3 className="font-bold text-sm text-slate-900">100% In-Browser Privacy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No iPhone photos are ever transmitted over external networks. Complete client-side security.
          </p>
        </div>
      </div>

    </div>
  );
};
