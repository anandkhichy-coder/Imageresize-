import heic2any from 'heic2any';
import { PassportPreset } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const url = URL.createObjectURL(source);
      img.src = url;
      // Clean up object url after load
      img.onload = () => {
        resolve(img);
      };
    }
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Intelligent binary search target KB compression
 */
export async function compressImageToTargetKB(
  img: HTMLImageElement,
  targetKB: number,
  mimeType: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg'
): Promise<{ blob: Blob; width: number; height: number; quality: number }> {
  const targetBytes = targetKB * 1024;
  let curWidth = img.naturalWidth || img.width;
  let curHeight = img.naturalHeight || img.height;

  // For PNG, if targetKB is strict, converting to JPEG or WEBP is much more reliable
  const format = mimeType === 'image/png' ? 'image/jpeg' : mimeType;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;
  let bestWidth = curWidth;
  let bestHeight = curHeight;

  // Try multiple scale passes if necessary
  for (let scalePass = 0; scalePass < 5; scalePass++) {
    const scale = Math.pow(0.85, scalePass);
    const w = Math.max(80, Math.round(curWidth * scale));
    const h = Math.max(80, Math.round(curHeight * scale));

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    // Binary search for quality
    let minQ = 0.05;
    let maxQ = 0.98;
    let foundUnderTarget = false;

    for (let iter = 0; iter < 7; iter++) {
      const q = (minQ + maxQ) / 2;
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, format, q)
      );

      if (!blob) continue;

      if (blob.size <= targetBytes) {
        foundUnderTarget = true;
        bestBlob = blob;
        bestQuality = q;
        bestWidth = w;
        bestHeight = h;
        // Try higher quality
        minQ = q;
      } else {
        // Too large, try lower quality
        maxQ = q;
      }
    }

    if (foundUnderTarget && bestBlob) {
      break;
    }
  }

  // Fallback if still too large (extreme compression)
  if (!bestBlob) {
    canvas.width = Math.round(curWidth * 0.4);
    canvas.height = Math.round(curHeight * 0.4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    bestBlob = (await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, format, 0.2)
    )) || new Blob([], { type: format });
    bestWidth = canvas.width;
    bestHeight = canvas.height;
    bestQuality = 0.2;
  }

  return {
    blob: bestBlob,
    width: bestWidth,
    height: bestHeight,
    quality: bestQuality,
  };
}

/**
 * Standard quality-based compressor
 */
export async function compressImageWithQuality(
  img: HTMLImageElement,
  quality: number,
  mimeType: string = 'image/jpeg',
  targetWidth?: number,
  targetHeight?: number
): Promise<{ blob: Blob; width: number; height: number }> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const w = targetWidth || img.naturalWidth || img.width;
  const h = targetHeight || img.naturalHeight || img.height;

  canvas.width = w;
  canvas.height = h;

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.clearRect(0, 0, w, h);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob) throw new Error('Failed to encode image');

  return { blob, width: w, height: h };
}

/**
 * Photo Resizer tool logic
 */
export async function resizeImage(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  mimeType: string = 'image/jpeg',
  quality = 0.92,
  dpi = 72
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Resize failed'));
    }, mimeType, quality);
  });
}

/**
 * Interactive Cropper logic
 */
export async function cropImage(
  img: HTMLImageElement,
  cropArea: { x: number; y: number; width: number; height: number },
  rotation: number = 0,
  flipH: boolean = false,
  flipV: boolean = false,
  mimeType: string = 'image/png',
  quality = 0.95
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  canvas.width = Math.max(1, Math.round(cropArea.width));
  canvas.height = Math.max(1, Math.round(cropArea.height));

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  // Draw the cropped portion
  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  ctx.restore();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Crop failed'));
    }, mimeType, quality);
  });
}

/**
 * Convert RGB to YCbCr to detect human skin tones
 */
function isHumanSkin(r: number, g: number, b: number): boolean {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return y > 35 && cb >= 75 && cb <= 135 && cr >= 130 && cr <= 180;
}

/**
 * Perceptual Color distance
 */
function colorDistPerceptual(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rMean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
}

/**
 * Background Remover - Biometric Anatomical & Shirt Protected Segmenter
 * Protects human face, hair, neck, and clothing/shirt (white, checkered, dark, or patterned)
 */
export async function removeBackgroundCanvas(
  img: HTMLImageElement,
  options: {
    mode: 'transparent' | 'color' | 'gradient' | 'blur';
    bgColor?: string;
    gradientStart?: string;
    gradientEnd?: string;
    tolerance?: number;
    edgeSmooth?: boolean;
    blurRadius?: number;
    customMask?: Uint8Array;
  }
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas not supported');

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  canvas.width = w;
  canvas.height = h;

  // Draw original image
  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let mask: Uint8Array;

  if (options.customMask && options.customMask.length === w * h) {
    mask = options.customMask;
  } else {
    // 1. Grayscale and Sobel Edge Barrier Map
    const gray = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      gray[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    }

    const grad = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const gx =
          -gray[idx - w - 1] + gray[idx - w + 1] -
          2 * gray[idx - 1] + 2 * gray[idx + 1] -
          gray[idx + w - 1] + gray[idx + w + 1];
        const gy =
          -gray[idx - w - 1] - 2 * gray[idx - w] - gray[idx - w + 1] +
          gray[idx + w - 1] + 2 * gray[idx + w] + gray[idx + w + 1];
        grad[idx] = Math.hypot(gx, gy);
      }
    }

    // 2. Sample Background Seeds from perimeter (all 4 corners and borders)
    const borderSamples: [number, number, number][] = [];
    const sampleBorder = (x: number, y: number) => {
      const idx = (y * w + x) * 4;
      borderSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
    };

    const stepX = Math.max(1, Math.floor(w / 40));
    const stepY = Math.max(1, Math.floor(h / 40));
    for (let x = 0; x < w; x += stepX) {
      sampleBorder(x, 0);
      sampleBorder(x, h - 1);
    }
    for (let y = 0; y < h; y += stepY) {
      sampleBorder(0, y);
      sampleBorder(w - 1, y);
    }

    if (borderSamples.length === 0) {
      borderSamples.push([data[0], data[1], data[2]]);
    }

    // 3. Initialize Mask: 255 = Subject (Foreground), 0 = Background (Removed)
    mask = new Uint8Array(w * h);
    mask.fill(255);

    const visited = new Uint8Array(w * h);
    const queueX = new Int32Array(w * h);
    const queueY = new Int32Array(w * h);
    let head = 0;
    let tail = 0;

    const baseTolerance = (options.tolerance || 30) * 1.5;
    const edgeThreshold = 55;

    const isColorMatchBg = (r: number, g: number, b: number, customTol: number) => {
      for (const [bgR, bgG, bgB] of borderSamples) {
        if (colorDistPerceptual(r, g, b, bgR, bgG, bgB) < customTol) {
          return true;
        }
      }
      return false;
    };

    // Seed from all 4 borders
    const trySeed = (x: number, y: number) => {
      const idx = y * w + x;
      if (visited[idx]) return;
      const pIdx = idx * 4;
      const r = data[pIdx], g = data[pIdx + 1], b = data[pIdx + 2];

      if (isColorMatchBg(r, g, b, baseTolerance * 1.35)) {
        visited[idx] = 1;
        mask[idx] = 0;
        queueX[tail] = x;
        queueY[tail] = y;
        tail++;
      }
    };

    for (let x = 0; x < w; x++) {
      trySeed(x, 0);
      trySeed(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      trySeed(0, y);
      trySeed(w - 1, y);
    }

    // 4. Run BFS Flood Fill
    while (head < tail) {
      const cx = queueX[head];
      const cy = queueY[head];
      head++;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        const nIdx = ny * w + nx;
        if (visited[nIdx]) continue;

        // Stop at strong outer subject silhouette contour edges
        if (grad[nIdx] > edgeThreshold) {
          visited[nIdx] = 1;
          continue;
        }

        const npIdx = nIdx * 4;
        const nr = data[npIdx];
        const ng = data[npIdx + 1];
        const nb = data[npIdx + 2];

        // Central facial skin protection
        if (ny < h * 0.65 && nx > w * 0.2 && nx < w * 0.8 && isHumanSkin(nr, ng, nb)) {
          visited[nIdx] = 1;
          continue;
        }

        if (isColorMatchBg(nr, ng, nb, baseTolerance)) {
          visited[nIdx] = 1;
          mask[nIdx] = 0;
          queueX[tail] = nx;
          queueY[tail] = ny;
          tail++;
        } else {
          visited[nIdx] = 1;
        }
      }
    }

    // 5. Solidify Subject Core & Fill Shirt Pockets / Pattern Holes
    const refinedMask = new Uint8Array(mask);
    for (let y = 2; y < h - 2; y++) {
      for (let x = 2; x < w - 2; x++) {
        const idx = y * w + x;
        if (mask[idx] === 0) {
          let fgNeighbors = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (mask[(y + dy) * w + (x + dx)] === 255) fgNeighbors++;
            }
          }
          if (fgNeighbors >= 15) {
            refinedMask[idx] = 255;
          }
        }
      }
    }
    mask = refinedMask;
  }

  // 5. Alpha Matting & Edge Feathering
  const cutoutCanvas = document.createElement('canvas');
  cutoutCanvas.width = w;
  cutoutCanvas.height = h;
  const cutoutCtx = cutoutCanvas.getContext('2d', { willReadFrequently: true });
  if (!cutoutCtx) throw new Error('Cutout canvas failed');

  const cutoutData = cutoutCtx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const pIdx = idx * 4;

      cutoutData.data[pIdx] = data[pIdx];
      cutoutData.data[pIdx + 1] = data[pIdx + 1];
      cutoutData.data[pIdx + 2] = data[pIdx + 2];

      if (mask[idx] === 255) {
        cutoutData.data[pIdx + 3] = data[pIdx + 3];
      } else {
        // Soft feathering for border pixels
        let neighborFg = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              if (mask[ny * w + nx] === 255) neighborFg++;
            }
          }
        }
        if (neighborFg > 0) {
          cutoutData.data[pIdx + 3] = Math.round((neighborFg / 9) * data[pIdx + 3]);
        } else {
          cutoutData.data[pIdx + 3] = 0;
        }
      }
    }
  }
  cutoutCtx.putImageData(cutoutData, 0, 0);

  // 6. Render with chosen background mode
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = w;
  finalCanvas.height = h;
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) throw new Error('Final canvas failed');

  if (options.mode === 'color' && options.bgColor) {
    finalCtx.fillStyle = options.bgColor;
    finalCtx.fillRect(0, 0, w, h);
  } else if (options.mode === 'gradient') {
    const grad = finalCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, options.gradientStart || '#3b82f6');
    grad.addColorStop(1, options.gradientEnd || '#1e3a8a');
    finalCtx.fillStyle = grad;
    finalCtx.fillRect(0, 0, w, h);
  } else if (options.mode === 'blur') {
    finalCtx.filter = `blur(${options.blurRadius || 18}px)`;
    finalCtx.drawImage(img, -20, -20, w + 40, h + 40);
    finalCtx.filter = 'none';
  } else {
    finalCtx.clearRect(0, 0, w, h);
  }

  // Draw cleanly separated subject cutout
  finalCtx.drawImage(cutoutCanvas, 0, 0);

  const format = options.mode === 'transparent' ? 'image/png' : 'image/jpeg';
  return new Promise<Blob>((resolve, reject) => {
    finalCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Background removal failed'));
    }, format, 0.95);
  });
}

/**
 * WhatsApp DP Resizer (Full DP without crop)
 */
export async function generateWhatsAppDp(
  img: HTMLImageElement,
  options: {
    mode: 'blur' | 'white' | 'black' | 'gradient';
    size?: number;
    gradientStart?: string;
    gradientEnd?: string;
  }
): Promise<Blob> {
  const size = options.size || 1080;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  if (options.mode === 'blur') {
    // Fill background with blurred, zoomed original
    ctx.save();
    ctx.filter = 'blur(28px) brightness(0.9)';
    const scale = Math.max(size / imgW, size / imgH) * 1.2;
    const bgW = imgW * scale;
    const bgH = imgH * scale;
    ctx.drawImage(img, (size - bgW) / 2, (size - bgH) / 2, bgW, bgH);
    ctx.restore();

    // Subtle dark overlay for contrast
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, size, size);
  } else if (options.mode === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  } else if (options.mode === 'black') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);
  } else if (options.mode === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, options.gradientStart || '#6366f1');
    grad.addColorStop(1, options.gradientEnd || '#a855f7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  // Calculate contain fit for the foreground photo
  const scale = Math.min(size / imgW, size / imgH);
  const targetW = imgW * scale;
  const targetH = imgH * scale;
  const offsetX = (size - targetW) / 2;
  const offsetY = (size - targetH) / 2;

  // Add subtle drop shadow behind foreground image
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  ctx.drawImage(img, offsetX, offsetY, targetW, targetH);
  ctx.restore();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('WhatsApp DP generation failed'));
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Passport Photo Grid Generator
 */
export async function generatePassportGrid(
  photoImg: HTMLImageElement,
  preset: PassportPreset,
  paperFormat: '4x6' | 'A4' | 'single',
  copies: number = 8
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  if (paperFormat === 'single') {
    canvas.width = preset.widthPx;
    canvas.height = preset.heightPx;
    ctx.fillStyle = preset.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photoImg, 0, 0, canvas.width, canvas.height);

    // Fine cut border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  } else if (paperFormat === '4x6') {
    // 4x6 inches at 300 DPI = 1200 x 1800 px (or 1800 x 1200 landscape)
    canvas.width = 1800;
    canvas.height = 1200;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pw = preset.widthPx;
    const ph = preset.heightPx;
    const cols = 4;
    const rows = 2;
    const marginX = (canvas.width - cols * pw) / (cols + 1);
    const marginY = (canvas.height - rows * ph) / (rows + 1);

    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count >= copies) break;
        const x = marginX + c * (pw + marginX);
        const y = marginY + r * (ph + marginY);

        // Draw photo
        ctx.fillStyle = preset.bgColor;
        ctx.fillRect(x, y, pw, ph);
        ctx.drawImage(photoImg, x, y, pw, ph);

        // Border line for cutting
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, pw, ph);

        count++;
      }
    }
  } else {
    // A4 sheet at 300 DPI = 2480 x 3508 px
    canvas.width = 2480;
    canvas.height = 3508;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pw = preset.widthPx;
    const ph = preset.heightPx;
    const cols = 5;
    const rows = 6;
    const marginX = (canvas.width - cols * pw) / (cols + 1);
    const marginY = (canvas.height - rows * ph) / (rows + 1);

    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count >= copies) break;
        const x = marginX + c * (pw + marginX);
        const y = marginY + r * (ph + marginY);

        ctx.fillStyle = preset.bgColor;
        ctx.fillRect(x, y, pw, ph);
        ctx.drawImage(photoImg, x, y, pw, ph);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, pw, ph);

        count++;
      }
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Passport grid failed'));
    }, 'image/jpeg', 0.98);
  });
}

/**
 * Signature cleaner for govt exam forms
 */
export async function cleanSignatureCanvas(
  img: HTMLImageElement,
  contrastThreshold = 180
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas not supported');

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    // Grayscale luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum > contrastThreshold) {
      // Whiten paper
      d[i] = 255;
      d[i + 1] = 255;
      d[i + 2] = 255;
    } else {
      // Darken ink to deep dark blue/black
      const factor = lum / contrastThreshold;
      d[i] = Math.round(r * factor * 0.4);
      d[i + 1] = Math.round(g * factor * 0.4);
      d[i + 2] = Math.round(b * factor * 0.5);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Signature clean failed'));
    }, 'image/jpeg', 0.92);
  });
}

/**
 * Convert Apple HEIC to standard JPG/PNG
 */
export async function convertHeicToJpg(file: File, toFormat: 'image/jpeg' | 'image/png' = 'image/jpeg'): Promise<Blob> {
  try {
    const conversionResult = await heic2any({
      blob: file,
      toType: toFormat,
      quality: 0.92,
    });
    return Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
  } catch (error) {
    console.error('HEIC conversion error:', error);
    throw new Error('Could not convert HEIC file. Please make sure it is a valid Apple HEIC image.');
  }
}
