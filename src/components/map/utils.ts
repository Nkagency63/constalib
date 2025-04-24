
import L from 'leaflet';
import { Vehicle } from './types';

export const createVehicleIcon = (vehicle: Vehicle, isSelected: boolean) => {
  return L.divIcon({
    className: '',
    html: `
      <div style="position: relative;">
        <div style="
          width: 40px; 
          height: 80px; 
          background-color: ${vehicle.color}; 
          border-radius: 8px;
          transform: translate(-50%, -50%) rotate(${vehicle.rotation}deg);
          display: flex;
          align-items: center;
          justify-content: center;
          ${isSelected ? 'box-shadow: 0 0 0 4px #3b82f6;' : ''}
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          padding: 0 4px;
          border-radius: 4px;
          font-size: 12px;
          color: #4b5563;
          white-space: nowrap;
        ">
          ${vehicle.label}
        </div>
        ${isSelected ? `
          <div style="
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 4px;
          ">
            <button class="vehicle-rotate-left" style="
              background-color: white;
              border-radius: 9999px;
              padding: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 15L8 11L4 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="vehicle-rotate-right" style="
              background-color: white;
              border-radius: 9999px;
              padding: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 15L16 11L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="vehicle-remove" style="
              background-color: white;
              border-radius: 9999px;
              padding: 4px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
              color: #ef4444;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [40, 80],
    iconAnchor: [20, 40],
  });
};

export const generateVehicle = (vehicles: Vehicle[], center: [number, number]): Vehicle => {
  const colors = ['#ff9f43', '#0abde3', '#10ac84', '#ee5253'];
  const offset = 0.0001 * vehicles.length;
  
  return {
    id: `vehicle-${Date.now()}`,
    position: new L.LatLng(center[0] + offset, center[1] + offset),
    rotation: 0,
    color: colors[vehicles.length % colors.length],
    label: `Véhicule ${vehicles.length + 1}`
  };
};
