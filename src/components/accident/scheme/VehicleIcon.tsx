
import React from 'react';

interface VehicleIconProps {
  type: 'car' | 'truck' | 'bike';
  color: string;
  rotation: number;
  selected?: boolean;
}

const VehicleIcon: React.FC<VehicleIconProps> = ({ type, color, rotation, selected }) => {
  const baseStyle = {
    transform: `rotate(${rotation}deg)`,
    fill: color,
    stroke: selected ? '#000' : 'none',
    strokeWidth: selected ? '2' : '0',
  };

  switch (type) {
    case 'car':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
          style={baseStyle}
          width="40" 
          height="40"
        >
          <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
        </svg>
      );
    case 'truck':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
          style={baseStyle}
          width="40" 
          height="40"
        >
          <path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z" />
        </svg>
      );
    case 'bike':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
          style={baseStyle}
          width="40" 
          height="40"
        >
          <path d="M19.5,9.5C19.5,10.3 19.3,11.1 19,11.8C21.2,12.7 23,14.9 23,17.5C23,20.5 20.5,23 17.5,23C15.8,23 14.1,22.3 13,21H11C9.9,22.3 8.2,23 6.5,23C3.5,23 1,20.5 1,17.5C1,14.9 2.8,12.7 5,11.8C4.7,11.1 4.5,10.3 4.5,9.5C4.5,6.5 7,4 10,4C10.3,4 10.7,4 11,4.1L15.5,0L18.5,2L15,6H11.5V8H16.5L19.5,9.5M6.5,18.5C7.3,18.5 8,17.8 8,17C8,16.2 7.3,15.5 6.5,15.5C5.7,15.5 5,16.2 5,17C5,17.8 5.7,18.5 6.5,18.5M17.5,18.5C18.3,18.5 19,17.8 19,17C19,16.2 18.3,15.5 17.5,15.5C16.7,15.5 16,16.2 16,17C16,17.8 16.7,18.5 17.5,18.5Z" />
        </svg>
      );
    default:
      return null;
  }
};

export default VehicleIcon;
