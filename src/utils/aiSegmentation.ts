import { removeBackground } from '@imgly/background-removal';
import { loadImage } from './imageUtils';

/**
 * Robust AI Background Segmenter
 * Pre-scales image to prevent WASM out-of-memory aborts, runs neural network silently in background,
 * and composites full-resolution alpha mask back to original dimensions.
 */
export async function segmentWithAI(
  imageSource: File | Blob | HTMLImageElement,
  onProgress?: (pct: number) => void
): Promise<Blob | null> {
  try {
    // 1. Get HTMLImageElement
    let img: HTMLImageElement;
    let cleanupUrl: string | null = null;

    if (imageSource instanceof HTMLImageElement) {
      img = imageSource;
    } else {
      cleanupUrl = URL.createObjectURL(imageSource);
      img = await loadImage(cleanupUrl);
    }

    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;

    // 2. Downscale to max 1024px for WASM stability & fast performance
    const maxDim = 1024;
    let targetW = origW;
    let targetH = origH;
    if (origW > maxDim || origH > maxDim) {
      if (origW > origH) {
        targetW = maxDim;
        targetH = Math.max(1, Math.round((origH * maxDim) / origW));
      } else {
        targetH = maxDim;
        targetW = Math.max(1, Math.round((origW * maxDim) / origH));
      }
    }

    const scaleCanvas = document.createElement('canvas');
    scaleCanvas.width = targetW;
    scaleCanvas.height = targetH;
    const sCtx = scaleCanvas.getContext('2d');
    if (!sCtx) {
      if (cleanupUrl) URL.revokeObjectURL(cleanupUrl);
      return null;
    }
    sCtx.drawImage(img, 0, 0, targetW, targetH);

    const inputBlob = await new Promise<Blob | null>((res) => scaleCanvas.toBlob(res, 'image/jpeg', 0.95));
    if (!inputBlob) {
      if (cleanupUrl) URL.revokeObjectURL(cleanupUrl);
      return null;
    }

    // 3. Execute background removal with isnet_fp16
    let cutoutResultBlob: Blob | null = null;
    try {
      cutoutResultBlob = await removeBackground(inputBlob, {
        model: 'isnet_fp16',
        publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
        output: { format: 'image/png', quality: 1.0 },
        progress: (key: string, current: number, total: number) => {
          if (total > 0 && onProgress) {
            onProgress(Math.round((current / total) * 100));
          }
        },
      });
    } catch (e1) {
      try {
        // Fallback CDN
        cutoutResultBlob = await removeBackground(inputBlob, {
          output: { format: 'image/png', quality: 1.0 },
          progress: (key: string, current: number, total: number) => {
            if (total > 0 && onProgress) {
              onProgress(Math.round((current / total) * 100));
            }
          },
        });
      } catch (e2) {
        cutoutResultBlob = null;
      }
    }

    if (cleanupUrl) {
      URL.revokeObjectURL(cleanupUrl);
    }

    if (!cutoutResultBlob) return null;

    // 4. Upscale alpha mask cleanly to original resolution if scaled
    if (origW !== targetW || origH !== targetH) {
      const cutoutImgUrl = URL.createObjectURL(cutoutResultBlob);
      try {
        const cutoutImg = await loadImage(cutoutImgUrl);
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = origW;
        finalCanvas.height = origH;
        const fCtx = finalCanvas.getContext('2d');
        if (!fCtx) return cutoutResultBlob;

        // Draw original high-res image
        fCtx.drawImage(img, 0, 0, origW, origH);

        // Apply alpha mask from cutoutImg using destination-in
        fCtx.globalCompositeOperation = 'destination-in';
        fCtx.drawImage(cutoutImg, 0, 0, origW, origH);

        return await new Promise<Blob | null>((res) => finalCanvas.toBlob(res, 'image/png'));
      } finally {
        URL.revokeObjectURL(cutoutImgUrl);
      }
    }

    return cutoutResultBlob;
  } catch (err) {
    return null;
  }
}



