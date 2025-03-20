
import React from 'react';
import { Car, Zap } from 'lucide-react';

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
        
        {/* Lightning damage indicator at front */}
        <div className="absolute -top-1 -right-1">
          <div className="bg-white rounded-full p-0.5">
            <Zap 
              size={size/4} 
              className="text-[#1EAEDB] fill-[#1EAEDB]" 
            />
          </div>
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
