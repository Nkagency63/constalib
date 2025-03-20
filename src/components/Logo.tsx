
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/ce3632de-8cea-4095-9745-72435eab8739.png" 
        alt="Constalib Logo" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Logo;
