import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'flag-only' | 'icon-only';
}

const Logo = ({
  className = "",
  size = "md",
  variant = "full"
}: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
    xl: "h-20",
    '2xl': "h-32"
  };
  
  if (variant === 'full') {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src="/lovable-uploads/076c70e7-8ab0-4280-a52d-8f4a2285ec80.png" 
          alt="Constalib Logo" 
          className={`${sizeClasses[size]}`} 
        />
      </div>
    );
  } else if (variant === 'icon-only') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`${sizeClasses[size]} aspect-square rounded-full bg-constalib-blue flex items-center justify-center`}>
          <span className="text-white font-serif font-bold text-2xl">C</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex h-8">
          <div className="h-full w-2.5 bg-blue-900"></div>
          <div className="h-full w-2.5 bg-white"></div>
          <div className="h-full w-2.5 bg-red-600"></div>
        </div>
      </div>
    );
  }
};

export default Logo;
