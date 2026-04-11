/**
 * bootstrap.tsx — Admin микрофронтэнд эхлүүлэх файл
 *
 * index.ts-ийн dynamic import-аар ачаалагдана.
 * JSF хуудас дахь #microfrontend-root DOM элемент дотор
 * Admin аппликэйшнийг React 18 createRoot API-аар зурна.
 */
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('microfrontend-root');

if (container) {
  container.innerHTML = '';
  createRoot(container).render(<App />);
} else {
  console.error('[module-admin] #microfrontend-root элемент олдсонгүй');
}
