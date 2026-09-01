import { ToolMeta, GovtPreset, PassportPreset } from '../types';

export const TOOLS_LIST: ToolMeta[] = [
  {
    id: 'compressor',
    name: 'Image Compressor — Compress to 50KB/100KB',
    shortName: 'Image Compressor',
    badge: 'High Traffic',
    category: 'compress',
    seoTitle: 'Image Compressor — Compress Image to 50KB, 20KB, 100KB Online Free',
    seoDescription: 'Compress image to 50KB, 20KB, 100KB, or 200KB online for free without losing quality. Ideal for government exam forms, job portals, and web optimization.',
    keywords: ['compress image to 50kb', 'image compressor', 'compress photo to 20kb', 'compress jpg to 100kb', 'reduce image size in kb', 'photo size reducer'],
    icon: 'Minimize2',
    tagline: 'Reduce file size to exact target KB (20KB, 50KB, 100KB) with instant preview',
    popular: true
  },
  {
    id: 'resizer',
    name: 'Photo Resizer — Resize Image Online Free',
    shortName: 'Photo Resizer',
    category: 'resize',
    seoTitle: 'Photo Resizer — Resize Image Online Free in Pixels, CM, Inches',
    seoDescription: 'Resize JPG, PNG, and WEBP images online for free. Change image dimensions by pixels, percentage, or centimeters with aspect ratio lock.',
    keywords: ['resize image online free', 'photo resizer', 'image resize in pixels', 'picture dimension changer', 'online photo resizer'],
    icon: 'Maximize2',
    tagline: 'Change dimensions by pixels, percentage, or mm with aspect ratio lock',
    popular: true
  },
  {
    id: 'bg-remover',
    name: 'Background Remover — Remove Background Online Free',
    shortName: 'Background Remover',
    badge: '10x Traffic',
    category: 'ai',
    seoTitle: 'Remove Background Online Free — Instant Transparent & White BG',
    seoDescription: '100% Free online background remover. Remove photo background instantly, make transparent PNG, or add white/custom color backgrounds in seconds.',
    keywords: ['remove background online free', 'free background remover', 'remove bg', 'transparent background maker', 'white background photo editor'],
    icon: 'Eraser',
    tagline: 'One-click automatic cutout + transparent, white or custom color backdrops',
    popular: true
  },
  {
    id: 'img-to-pdf',
    name: 'Image to PDF Converter — JPG to PDF Online',
    shortName: 'Image to PDF',
    badge: 'Massive Traffic',
    category: 'convert',
    seoTitle: 'Image to PDF Converter — Convert JPG, PNG to PDF Online Free',
    seoDescription: 'Convert JPG, PNG, WEBP images to PDF document online for free. Combine multiple photos into a single PDF with custom page size, orientation, and margins.',
    keywords: ['jpg to pdf', 'image to pdf online', 'convert photo to pdf', 'multiple images to single pdf', 'png to pdf free'],
    icon: 'FileText',
    tagline: 'Merge multiple JPG/PNG images into a single professional PDF document',
    popular: true
  },
  {
    id: 'passport',
    name: 'Passport Photo Maker — 35x45mm & 2x2"',
    shortName: 'Passport Photo Maker',
    badge: 'High Search',
    category: 'specialized',
    seoTitle: 'Passport Size Photo Maker Online — 35x45mm & 2x2 Inch Free',
    seoDescription: 'Create passport size photos online for India, US Visa, Schengen, UK, and Canada. 35x45mm and 2x2 inch with white/blue background & printable 4x6 sheet.',
    keywords: ['passport size photo online', 'passport photo 35x45mm', '2x2 photo maker', 'us visa photo generator', 'passport photo printable sheet'],
    icon: 'UserSquare2',
    tagline: 'Create 35x45mm & 2x2" visa/passport photos with printable 4x6 sheets',
    popular: true
  },
  {
    id: 'whatsapp-dp',
    name: 'WhatsApp DP Resizer — Full DP Without Crop',
    shortName: 'WhatsApp DP Resizer',
    badge: 'Trending',
    category: 'specialized',
    seoTitle: 'WhatsApp DP Resizer — Set Full Profile Picture Without Crop Online',
    seoDescription: 'Resize photos for WhatsApp DP without cropping. Add blurred background or square white borders with live circular preview guide.',
    keywords: ['whatsapp profile photo size', 'whatsapp dp resize', 'full dp without crop', 'square fit photo for whatsapp', 'whatsapp dp maker'],
    icon: 'Smile',
    tagline: 'Square fit your full photo with blurred background and circle preview guide',
    popular: true
  },
  {
    id: 'govt-form',
    name: 'Aadhaar / Government Form Photo Resizer',
    shortName: 'Govt Form Resizer',
    badge: 'Exam Special',
    category: 'specialized',
    seoTitle: 'Govt Form Photo & Signature Resizer — Aadhaar, SSC, UPSC, PAN, Bank',
    seoDescription: 'Resize photo and signature for Indian government exams & portal applications. Instant presets for SSC CGL, UPSC, Aadhaar, PAN Card, IBPS, and Driving License.',
    keywords: ['photo resize for government form', 'aadhaar photo size', 'ssc photo resizer 20 to 50kb', 'upsc photo and signature resizer', 'pan card photo size'],
    icon: 'Award',
    tagline: 'Exact dimensions and KB limits for SSC, UPSC, Aadhaar, PAN Card & Bank exams',
    popular: true
  },
  {
    id: 'converter',
    name: 'JPG PNG WEBP Converter Online',
    shortName: 'Image Converter',
    category: 'convert',
    seoTitle: 'JPG PNG WEBP Converter Online — Convert Image Format Free',
    seoDescription: 'Free online image format converter. Convert JPG to PNG, PNG to JPG, WEBP to JPG, AVIF to PNG with batch processing and high quality.',
    keywords: ['jpg png webp converter online', 'convert jpg to png', 'convert webp to jpg', 'online image converter', 'heic converter'],
    icon: 'RefreshCw',
    tagline: 'Convert between JPG, PNG, WEBP, AVIF, and GIF instantly in your browser',
    popular: false
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG Converter Online',
    shortName: 'HEIC to JPG',
    badge: 'iPhone Fix',
    category: 'convert',
    seoTitle: 'HEIC to JPG Converter — Convert iPhone HEIC Photos to JPG Free',
    seoDescription: 'Convert Apple iPhone HEIC and HEIF photos to JPG or PNG format online for free. Fast, secure, batch conversion with 100% privacy.',
    keywords: ['heic to jpg', 'convert heic to jpg online', 'iphone photo converter', 'heic to png free', 'batch heic converter'],
    icon: 'Smartphone',
    tagline: 'Convert Apple iPhone .HEIC photos to universal JPG/PNG format effortlessly',
    popular: true
  },
  {
    id: 'bulk-compress',
    name: 'Bulk Image Compressor — Multi File',
    shortName: 'Bulk Compressor',
    category: 'compress',
    seoTitle: 'Bulk Image Compressor — Compress Multiple Images Online Free',
    seoDescription: 'Compress multiple JPG, PNG, and WEBP images at once online. Batch compress up to 50 photos to target KB and download as a ZIP file.',
    keywords: ['compress multiple images online', 'bulk image compressor', 'batch photo compress', 'compress 50 images at once', 'zip download compressed images'],
    icon: 'Layers',
    tagline: 'Compress dozens of images simultaneously and download all in a single ZIP',
    popular: true
  },
  {
    id: 'cropper',
    name: 'Photo Crop & Resize Tool',
    shortName: 'Photo Cropper',
    category: 'resize',
    seoTitle: 'Photo Crop & Resize Tool — Crop Images Online to Any Ratio',
    seoDescription: 'Crop JPG, PNG, WEBP photos online with custom aspect ratios (1:1, 16:9, 4:3, 9:16, 4:5). Rotate, flip, zoom and download in high resolution.',
    keywords: ['photo crop & resize tool', 'crop image online', 'photo cropper', 'image aspect ratio cropper', 'square crop tool'],
    icon: 'Crop',
    tagline: 'Interactive crop canvas with 1:1, 16:9, 4:5 presets, rotation and flip',
    popular: false
  },
  {
    id: 'target-kb',
    name: 'Compress Image to 20KB / 50KB / 100KB',
    shortName: 'Exact KB Target',
    badge: 'Direct Match',
    category: 'compress',
    seoTitle: 'Compress Image to 20KB, 50KB, 100KB Online Exact File Size',
    seoDescription: 'Exact match compressor to reduce image size to 20KB, 50KB, 100KB, or any specific byte size for job applications and online portals.',
    keywords: ['compress image to 50kb', 'compress image to 20kb', 'compress image to 100kb', 'reduce photo size to 50kb', 'resize photo to 20kb online'],
    icon: 'Sliders',
    tagline: 'One-click instant compression to 20KB, 50KB, 100KB or 200KB exact limit',
    popular: true
  }
];

export const GOVT_PRESETS: GovtPreset[] = [
  {
    id: 'ssc_photo',
    name: 'SSC CGL / CHSL / GD (Photo)',
    organization: 'Staff Selection Commission (SSC)',
    type: 'photo',
    recommendedWidth: 350,
    recommendedHeight: 450,
    unit: 'px',
    minSizeKB: 20,
    maxSizeKB: 50,
    targetKB: 40,
    dpi: 200,
    format: 'jpg',
    notes: 'Recent colored photo with light background. Dimensions approx 3.5cm x 4.5cm.'
  },
  {
    id: 'ssc_sign',
    name: 'SSC CGL / CHSL (Signature)',
    organization: 'Staff Selection Commission (SSC)',
    type: 'signature',
    recommendedWidth: 400,
    recommendedHeight: 200,
    unit: 'px',
    minSizeKB: 10,
    maxSizeKB: 20,
    targetKB: 15,
    dpi: 200,
    format: 'jpg',
    notes: 'Black/Blue ink on white paper, clearly visible without blur.'
  },
  {
    id: 'upsc_photo',
    name: 'UPSC Civil Services (Photo)',
    organization: 'Union Public Service Commission (UPSC)',
    type: 'photo',
    recommendedWidth: 350,
    recommendedHeight: 350,
    unit: 'px',
    minSizeKB: 20,
    maxSizeKB: 300,
    targetKB: 80,
    dpi: 300,
    format: 'jpg',
    notes: 'Candidate name and date of photograph printed on bottom if required.'
  },
  {
    id: 'upsc_sign',
    name: 'UPSC Civil Services (Signature)',
    organization: 'Union Public Service Commission (UPSC)',
    type: 'signature',
    recommendedWidth: 350,
    recommendedHeight: 150,
    unit: 'px',
    minSizeKB: 20,
    maxSizeKB: 300,
    targetKB: 50,
    dpi: 300,
    format: 'jpg',
    notes: 'Clear signature in dark ink.'
  },
  {
    id: 'aadhaar_doc',
    name: 'UIDAI Aadhaar Document / Photo',
    organization: 'UIDAI',
    type: 'photo',
    recommendedWidth: 600,
    recommendedHeight: 600,
    unit: 'px',
    minSizeKB: 50,
    maxSizeKB: 2000,
    targetKB: 300,
    dpi: 300,
    format: 'jpg',
    notes: 'Clear front-facing photo or document scan under 2MB.'
  },
  {
    id: 'pan_photo',
    name: 'NSDL / UTI PAN Card (Photo)',
    organization: 'Income Tax Department (PAN)',
    type: 'photo',
    recommendedWidth: 213,
    recommendedHeight: 213,
    unit: 'px',
    minSizeKB: 10,
    maxSizeKB: 30,
    targetKB: 25,
    dpi: 300,
    format: 'jpg',
    notes: '213 x 213 pixels, 300 DPI, strictly less than 30KB.'
  },
  {
    id: 'pan_sign',
    name: 'NSDL / UTI PAN Card (Signature)',
    organization: 'Income Tax Department (PAN)',
    type: 'signature',
    recommendedWidth: 400,
    recommendedHeight: 200,
    unit: 'px',
    minSizeKB: 5,
    maxSizeKB: 20,
    targetKB: 15,
    dpi: 300,
    format: 'jpg',
    notes: 'Black ink signature on clean white background, strictly under 20KB.'
  },
  {
    id: 'ibps_photo',
    name: 'IBPS / SBI Bank PO & Clerk (Photo)',
    organization: 'IBPS / State Bank of India',
    type: 'photo',
    recommendedWidth: 200,
    recommendedHeight: 230,
    unit: 'px',
    minSizeKB: 20,
    maxSizeKB: 50,
    targetKB: 35,
    dpi: 200,
    format: 'jpg',
    notes: '200 x 230 pixels, white/light background, size 20KB to 50KB.'
  },
  {
    id: 'ibps_sign',
    name: 'IBPS / SBI Bank PO & Clerk (Signature)',
    organization: 'IBPS / State Bank of India',
    type: 'signature',
    recommendedWidth: 140,
    recommendedHeight: 60,
    unit: 'px',
    minSizeKB: 10,
    maxSizeKB: 20,
    targetKB: 15,
    dpi: 200,
    format: 'jpg',
    notes: '140 x 60 pixels, black ink signature, size 10KB to 20KB.'
  },
  {
    id: 'parivahan_dl',
    name: 'Parivahan Driving License / Sarathi',
    organization: 'Ministry of Road Transport',
    type: 'photo',
    recommendedWidth: 420,
    recommendedHeight: 525,
    unit: 'px',
    minSizeKB: 10,
    maxSizeKB: 20,
    targetKB: 18,
    dpi: 200,
    format: 'jpg',
    notes: 'Strict limit: File size must be between 10KB and 20KB.'
  }
];

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    id: 'in_passport',
    country: 'India',
    title: 'Indian Passport / Visa / OCI (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    bgColor: '#ffffff',
    maxSizeKB: 100,
    notes: 'White background, neutral facial expression, front facing.'
  },
  {
    id: 'us_visa',
    country: 'United States',
    title: 'US Passport & Visa (2x2 inch / 51x51mm)',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    bgColor: '#ffffff',
    maxSizeKB: 240,
    notes: '600x600 px square, plain white background, eye level between 50-69% of height.'
  },
  {
    id: 'schengen_visa',
    country: 'Schengen / Europe',
    title: 'Schengen Visa (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    bgColor: '#f0f0f0',
    maxSizeKB: 200,
    notes: 'Light grey or white background, face covers 70-80% of photo.'
  },
  {
    id: 'uk_passport',
    country: 'United Kingdom',
    title: 'UK Passport (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    bgColor: '#f3f4f6',
    maxSizeKB: 150,
    notes: 'Light grey background, no shadows on face or backdrop.'
  },
  {
    id: 'ca_passport',
    country: 'Canada',
    title: 'Canadian Passport & Visa (50x70mm)',
    widthMm: 50,
    heightMm: 70,
    widthPx: 590,
    heightPx: 826,
    bgColor: '#ffffff',
    maxSizeKB: 300,
    notes: '50mm x 70mm, plain white or light-coloured background.'
  },
  {
    id: 'au_passport',
    country: 'Australia',
    title: 'Australian Passport (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    bgColor: '#ffffff',
    maxSizeKB: 200,
    notes: 'Plain white or light grey background, sharp focus.'
  }
];

export const SEO_FAQS = [
  {
    question: 'How do I compress an image to exactly 50KB or 20KB online?',
    answer: 'Select the "Image Compressor — Compress to 50KB/100KB" tool on imageresize.store, upload your photo, and click the "50KB" or "20KB" preset. Our smart iterative algorithm automatically balances the image quality and dimension to guarantee the output stays under your exact file size limit without noticeable visual degradation.'
  },
  {
    question: 'Are my uploaded photos secure and private on imageresize.store?',
    answer: 'Yes, 100%! All image resizing, compression, cropping, background removal, and PDF conversions happen locally in your web browser using HTML5 Canvas and WebAssembly. Your photos are NEVER uploaded to any external server or saved on cloud databases.'
  },
  {
    question: 'How do I resize a photo and signature for SSC, UPSC, and government exams?',
    answer: 'Go to our "Govt Form Resizer" tool, choose your exam preset (e.g., SSC CGL Photo 20-50KB, SSC Signature 10-20KB, PAN Card 213x213px), upload your file, and click "Resize & Compress". The output will match the exact pixel dimensions, DPI, and file size limits specified by the examination board.'
  },
  {
    question: 'How can I convert multiple JPG or PNG images into a single PDF document?',
    answer: 'Use the "Image to PDF Converter" tool. Drag and drop all your photos at once, reorder them as desired, choose your paper format (A4, US Letter, or Fit), adjust margins, and click "Download PDF".'
  },
  {
    question: 'Can I remove the background of an image and make it transparent or pure white?',
    answer: 'Yes! Our "Background Remover" tool automatically isolates the subject from the background. You can then download it as a transparent PNG or select instant preset backgrounds like pure white (ideal for e-commerce and IDs), solid colors, or artistic blurred backdrops.'
  },
  {
    question: 'How to convert iPhone HEIC photos to standard JPG format?',
    answer: 'Upload any Apple .HEIC / .HEIF file into our "HEIC to JPG Converter". It converts your photos to universal high-quality JPG or PNG images instantly so you can view, share, or upload them anywhere.'
  }
];
