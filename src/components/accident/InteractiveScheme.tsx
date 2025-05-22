
import React from 'react';
import L from 'leaflet';
import SchemeContainer from './scheme/SchemeContainer';
import { SchemeData } from './types';

// Add a head script to load Leaflet CSS from CDN
const ensureLeafletCss = () => {
  if (typeof document !== 'undefined') {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }
};

interface InteractiveSchemeProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  readOnly?: boolean;
}

const InteractiveScheme = ({ formData, onUpdateSchemeData, readOnly = false }: InteractiveSchemeProps) => {
  // Ensure Leaflet CSS is loaded
  React.useEffect(() => {
    ensureLeafletCss();
    
    // Fix Leaflet icon paths at runtime
    if (typeof window !== 'undefined' && window.L) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  return (
    <SchemeContainer
      formData={formData}
      onUpdateSchemeData={onUpdateSchemeData}
      readOnly={readOnly}
    />
  );
};

export default InteractiveScheme;
