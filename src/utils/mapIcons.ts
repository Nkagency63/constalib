
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
        transform: rotate(0deg);
        transform-origin: center;
        ${isSelected ? 'outline: 3px solid white; box-shadow: 0 0 0 1px ' + color + ', 0 0 10px rgba(0,0,0,0.3);' : ''}
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 17H5L3 15V13H21V15L19 17Z" stroke="white" stroke-width="2"/>
          <path d="M6 13V7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V13" stroke="white" stroke-width="2"/>
        </svg>
      </div>
    `
  });
};

export const createObstacleIcon = (type: string) => {
  const icons: Record<string, string> = {
    'cone': `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L20 20H4L12 4Z" fill="#FF9800" stroke="#E65100" stroke-width="2"/>
        <rect x="8" y="13" width="8" height="1.5" fill="white"/>
        <rect x="7" y="16" width="10" height="1.5" fill="white"/>
      </svg>
    `,
    'sign': `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#F44336" stroke="white" stroke-width="2"/>
        <rect x="6" y="11" width="12" height="2" fill="white"/>
      </svg>
    `,
    'tree': `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L6 15H18L12 3Z" fill="#4CAF50"/>
        <path d="M10 14V21H14V14" fill="#795548" stroke="#795548" stroke-width="1"/>
      </svg>
    `,
    'light': `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="4" width="10" height="20" fill="#424242"/>
        <circle cx="12" cy="8" r="4" fill="#F44336"/>
        <circle cx="12" cy="14" r="4" fill="#FFEB3B"/>
        <circle cx="12" cy="20" r="4" fill="#4CAF50"/>
      </svg>
    `
  };

  return new DivIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    html: `
      <div style="
        width: 30px; 
        height: 30px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
      ">
        ${icons[type] || icons['cone']}
      </div>
    `
  });
};

export const createAnnotationIcon = () => {
  return new DivIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    html: `
      <div style="
        width: 30px; 
        height: 30px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#1976D2"/>
        </svg>
      </div>
    `
  });
};
