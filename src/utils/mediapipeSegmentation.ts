import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { loadImage } from './imageUtils';

let selfieSegmenter: SelfieSegmentation | null = null;
let isInitializing = false;
let initPromise: Promise<SelfieSegmentation> | null = null;

async function getSelfieSegmenter(): Promise<SelfieSegmentation> {
  if (selfieSegmenter) return selfieSegmenter;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const segmenter = new SelfieSegmentation({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    segmenter.setOptions({
      modelSelection: 1, // 1: Landscape / full body / higher accuracy model
      selfieMode: false,
    });

    await segmenter.initialize();
    selfieSegmenter = segmenter;
    return segmenter;
  })();

  return initPromise;
}

/**
 * MediaPipe Selfie & Portrait Neural Segmentation
 * High accuracy, preserves hair, ears, face, shirt, clothing, shoulders and cuts out complex backgrounds cleanly.
 */
export async function segmentWithMediaPipe(
  imgElement: HTMLImageElement
): Promise<Blob | null> {
  try {
    const segmenter = await getSelfieSegmenter();
    const w = imgElement.naturalWidth || imgElement.width;
    const h = imgElement.naturalHeight || imgElement.height;

    return new Promise<Blob | null>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(null);
      }, 15000);

      segmenter.onResults((results) => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }

          // Draw the segmentation mask from results
          ctx.drawImage(results.segmentationMask, 0, 0, w, h);

          // Get mask pixel data
          const maskImgData = ctx.getImageData(0, 0, w, h);
          const maskPixels = maskImgData.data;

          // Clear canvas
          ctx.clearRect(0, 0, w, h);

          // Draw original image
          ctx.drawImage(imgElement, 0, 0, w, h);
          const origImgData = ctx.getImageData(0, 0, w, h);
          const origPixels = origImgData.data;

          // Apply soft alpha thresholding for clean cutout
          for (let i = 0; i < w * h; i++) {
            const pIdx = i * 4;
            const maskVal = maskPixels[pIdx]; // 0 (background) to 255 (person)

            if (maskVal < 35) {
              origPixels[pIdx + 3] = 0; // Cut out background
            } else if (maskVal < 180) {
              // Smooth feathered alpha transition on hair & clothing edges
              const alphaNorm = (maskVal - 35) / (180 - 35);
              origPixels[pIdx + 3] = Math.round(origPixels[pIdx + 3] * alphaNorm);
            }
            // else full opacity (person/shirt)
          }

          ctx.putImageData(origImgData, 0, 0);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        } catch (e) {
          resolve(null);
        }
      });

      segmenter.send({ image: imgElement }).catch(() => {
        clearTimeout(timeout);
        resolve(null);
      });
    });
  } catch (err) {
    return null;
  }
}
