
import { DivIcon } from 'leaflet';

export const createCarIcon = (color: string, isSelected: boolean = false) => {
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
        ${isSelected ? 'outline: 2px solid #3b82f6;' : ''}
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 17H5L3 15V13H21V15L19 17Z" stroke="white" stroke-width="2"/>
          <path d="M6 13V7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V13" stroke="white" stroke-width="2"/>
        </svg>
      </div>
    `
  });
};
