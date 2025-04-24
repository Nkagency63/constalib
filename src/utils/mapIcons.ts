
import { Icon, DivIcon } from 'leaflet';

// Create a car icon with rotation
export const createCarIcon = (color: string, rotation: number = 0, isSelected: boolean = false) => {
  return new DivIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background-color: ${color}; 
        border-radius: 4px;
        transform: rotate(${rotation}deg);
        ${isSelected ? 'outline: 2px solid #3b82f6;' : ''}
        transition: transform 0.3s ease;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 17H5L3 15V13H21V15L19 17Z" stroke="white" stroke-width="2"/>
          <path d="M6 13V7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V13" stroke="white" stroke-width="2"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: white;
        padding: 2px 4px;
        border-radius: 2px;
        font-size: 10px;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      ">
        ${rotation}°
      </div>
    `
  });
};
