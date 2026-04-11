/**
 * bootstrap.tsx — Student микрофронтэнд эхлүүлэх файл
 */
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('microfrontend-root');

if (container) {
  container.innerHTML = '';
  createRoot(container).render(<App />);
} else {
  console.error('[module-student] #microfrontend-root элемент олдсонгүй');
}
