
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
    sm: "h-6",  // Reduced from h-8
    md: "h-8",  // Reduced from h-10
    lg: "h-12", // Reduced from h-16
    xl: "h-16", // Reduced from h-20
    '2xl': "h-24" // Reduced from h-32
  };
  return <div className={`flex items-center ${className}`}>
      {variant === 'full' ? <img src="/lovable-uploads/ce3632de-8cea-4095-9745-72435eab8739.png" alt="Constalib Logo" className={`${sizeClasses[size]}`} /> : 
       variant === 'icon-only' ? <div className="flex h-6"> {/* Reduced from h-8 */}
          <div className="h-full w-2.5 bg-blue-900"></div>
          <div className="h-full w-2.5 bg-white"></div>
          <div className="h-full w-2.5 bg-red-600"></div>
        </div> : 
        <div className="flex h-6"> {/* Reduced from h-8 */}
          <div className="h-full w-2.5 bg-blue-900"></div>
          <div className="h-full w-2.5 bg-white"></div>
          <div className="h-full w-2.5 bg-red-600"></div>
        </div>}
    </div>;
};
export default Logo;
