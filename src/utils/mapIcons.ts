
import L from 'leaflet';

// Fonction pour créer une icône personnalisée pour les véhicules
export const createCarIcon = (
  color: string = '#1e88e5', 
  rotation: number = 0,
  isSelected: boolean = false,
  vehicleType: 'car' | 'truck' | 'bike' = 'car'
) => {
  // Obtenir l'icône SVG correspondant au type de véhicule
  const svgIcon = getVehicleSvgIcon(vehicleType, color, isSelected);
  
  // Créer une icône personnalisée avec un style spécifique
  return new L.DivIcon({
    className: 'custom-vehicle-icon',
    html: `<div style="transform: rotate(${rotation}deg); width: 100%; height: 100%;">${svgIcon}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Fonction pour créer une icône de marqueur personnalisée
export const createMapIcon = (color: string = '#10b981') => {
  return new L.DivIcon({
    className: 'custom-map-icon',
    html: `
      <div style="
        background-color: ${color}; 
        width: 12px; 
        height: 12px; 
        border-radius: 50%; 
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Fonction pour générer le SVG correspondant au type de véhicule
function getVehicleSvgIcon(vehicleType: 'car' | 'truck' | 'bike', color: string, isSelected: boolean): string {
  const strokeColor = isSelected ? 'white' : '#333';
  const strokeWidth = isSelected ? 2 : 1;
  const scale = isSelected ? 1.1 : 1.0;
  
  // Applique une bordure autour du véhicule s'il est sélectionné
  const selectedStyle = isSelected 
    ? `filter: drop-shadow(0px 0px 3px rgba(255,255,255,0.7));` 
    : '';
  
  let svgPath = '';
  
  // Définir la forme du véhicule en fonction de son type
  switch (vehicleType) {
    case 'car':
      svgPath = `<path d="M23,10l-2-5H9L7,10H2v2h1v7c0,1.1,0.9,2,2,2h1c1.1,0,2-0.9,2-2v-1h10v1c0,1.1,0.9,2,2,2h1c1.1,0,2-0.9,2-2v-7h1v-2H23z
       M7.5,11C6.7,11,6,10.3,6,9.5S6.7,8,7.5,8S9,8.7,9,9.5S8.3,11,7.5,11z M22.5,11c-0.8,0-1.5-0.7-1.5-1.5S21.7,8,22.5,8S24,8.7,24,9.5
       S23.3,11,22.5,11z" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
      break;
      
    case 'truck':
      svgPath = `<path d="M18 4v16h-6v-16h6m2-2h-10v20h10v-2h6v-12l-6-6z" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
                 <path d="M18 13h4v3h-4z" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
      break;
      
    case 'bike':
      svgPath = `<path d="M5.5,16c1.9,0,3.5-1.6,3.5-3.5S7.4,9,5.5,9S2,10.6,2,12.5S3.6,16,5.5,16z M18.5,9c-1.9,0-3.5,1.6-3.5,3.5
                 s1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5S20.4,9,18.5,9z M15,12.5c0-0.7,0.1-1.4,0.4-2H8.6L12,7H9L4,12.5V16h2v-2h10
                 C15.4,13.9,15,13.3,15,12.5z" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
      break;
  }
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="transform: scale(${scale}); ${selectedStyle}">
      ${svgPath}
    </svg>
  `;
}
