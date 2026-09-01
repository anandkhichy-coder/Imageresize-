import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign ONNX / WASM multi-threading warnings when crossOriginIsolated is unavailable
const origWarn = console.warn;
console.warn = (...args: any[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('numThreads') ||
    msg.includes('WebAssembly multi-threading') ||
    msg.includes('crossOriginIsolated')
  ) {
    return;
  }
  origWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

