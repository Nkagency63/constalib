
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import leaflet CSS globally to avoid import issues
import 'leaflet/dist/leaflet.css'

createRoot(document.getElementById("root")!).render(<App />);
