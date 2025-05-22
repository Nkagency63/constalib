
import L from 'leaflet';

export const createMapIcon = (color: string = '#3B82F6') => {
  return L.divIcon({
    className: 'custom-map-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 5px rgba(0,0,0,0.4);"></div>`,
  });
};

export const createCarIcon = (
  color: string = '#3B82F6', 
  rotation: number = 0, 
  isSelected: boolean = false,
  vehicleType: 'car' | 'truck' | 'bike' = 'car'
) => {
  const borderClass = isSelected ? 'border-2 border-white' : '';
  const selectionIndicator = isSelected ? '✓' : '';
  
  // Déterminer l'icône SVG en fonction du type de véhicule
  let vehicleIcon;
  
  switch (vehicleType) {
    case 'truck':
      vehicleIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 17h4V5H2v12h3"/>
          <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
          <circle cx="7.5" cy="17.5" r="2.5"/>
          <circle cx="17.5" cy="17.5" r="2.5"/>
        </svg>
      `;
      break;
    case 'bike':
      vehicleIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="5.5" cy="17.5" r="3.5"/>
          <circle cx="18.5" cy="17.5" r="3.5"/>
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
        </svg>
      `;
      break;
    default: // 'car'
      vehicleIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-1L9 6.3c-.7-.1-1.5.1-2.1.5L4 9.1c-.2.1-.1.4.2.4H7a2 2 0 0 1 2 1.6l.1.9"/>
          <path d="M9 17h6"/>
          <circle cx="7.5" cy="17.5" r="2.5"/>
          <circle cx="16.5" cy="17.5" r="2.5"/>
        </svg>
      `;
  }
  
  return L.divIcon({
    className: 'custom-car-icon',
    iconSize: [44, 44], // Increased size for better visibility
    iconAnchor: [22, 22],
    html: `
      <div class="${borderClass}" style="
        background-color: ${color}; 
        width: 38px; 
        height: 38px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        transform: rotate(${rotation}deg);
        position: relative;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
          ${selectionIndicator}
        </div>
        ${vehicleIcon}
        <!-- Direction arrow - more prominent -->
        <div style="
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 16px solid white;
          top: -16px;
          opacity: 0.9;">
        </div>
      </div>
    `,
  });
};

export const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `
      <div style="
        background-color: #4F46E5; 
        width: 16px; 
        height: 16px; 
        border-radius: 50%; 
        border: 2px solid white;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
      "></div>
    `,
  });
};
