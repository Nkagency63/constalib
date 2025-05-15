
import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet';
import L from 'leaflet';
import SchemeContainer from './scheme/SchemeContainer';
import { SchemeData } from './types';

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
  readOnly?: boolean;
}

const InteractiveScheme = ({ formData, onUpdateSchemeData, readOnly = false }: InteractiveSchemeProps) => (
  <SchemeContainer
    formData={formData}
    onUpdateSchemeData={onUpdateSchemeData}
    readOnly={readOnly}
  />
);

export default InteractiveScheme;
