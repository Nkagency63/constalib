
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
        src="/lovable-uploads/62a758fe-22b6-4af1-a3a2-85a652f8dc36.png" 
        alt="Constalib Logo" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Logo;
