
import React from 'react';
import { Car } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "", showText = true }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Blue car base with white interior */}
      <div className="relative">
        <Car 
          size={size} 
          className="text-constalib-blue fill-white" 
        />
        
        {/* Damage front overlay */}
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <svg 
            viewBox="0 0 24 24" 
            width={size/4} 
            height={size/4} 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M4,4 L20,20" 
              stroke="#FF3333" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
            <path 
              d="M20,4 L4,20" 
              stroke="#FF3333" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      
      {/* Company name - optional */}
      {showText && (
        <span className="text-constalib-blue font-bold text-lg ml-2">
          Constalib
        </span>
      )}
    </div>
  );
};

export default Logo;
