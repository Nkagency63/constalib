
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet';
import L from 'leaflet';
import SchemeContainer from './scheme/SchemeContainer';
import { SchemeData } from './types';
import { toast } from 'sonner';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Apply Leaflet icon fixes once
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface InteractiveSchemeProps {
  formData: any;
  onUpdateSchemeData: (data: SchemeData) => void;
  initialData?: SchemeData;
  readOnly?: boolean;
  activeTab?: string;
}

const InteractiveScheme: React.FC<InteractiveSchemeProps> = ({ 
  formData, 
  onUpdateSchemeData, 
  initialData,
  readOnly = false,
  activeTab = 'scheme'
}) => {
  const [mapKey, setMapKey] = useState<string>(`map-${Date.now()}`);
  
  // Log pour déboguer le composant
  useEffect(() => {
    console.log('InteractiveScheme mounted with:', {
      formData,
      initialData,
      readOnly,
      activeTab
    });

    // Reset map key when tab changes to force remount
    setMapKey(`map-${activeTab}-${Date.now()}`);

    // Force invalidation de taille de la carte après le montage
    const timer = setTimeout(() => {
      // Trouver toutes les cartes Leaflet sur la page
      document.querySelectorAll('.leaflet-container').forEach(mapElement => {
        console.log('Found Leaflet map element, invalidating size');
        try {
          // Tenter de forcer une mise à jour de la taille
          const event = new Event('resize');
          window.dispatchEvent(event);
        } catch (err) {
          console.error('Error during map resize:', err);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, initialData, readOnly, activeTab]);

  return (
    <div className="w-full h-full relative">
      <SchemeContainer
        key={mapKey}
        formData={formData}
        onUpdateSchemeData={onUpdateSchemeData}
        initialData={initialData}
        readOnly={readOnly}
        activeTab={activeTab}
      />
    </div>
  );
};

export default InteractiveScheme;
