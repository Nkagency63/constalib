
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS here globally

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="top-right" />
  </>
);
