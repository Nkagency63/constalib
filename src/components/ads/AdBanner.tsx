
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';

interface AdBannerProps {
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  link: string;
  onClose?: () => void;
  variant?: 'default' | 'premium';
}

const AdBanner = ({
  title,
  description,
  imageUrl,
  ctaText,
  link,
  onClose,
  variant = 'default'
}: AdBannerProps) => {
  const handleClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const getBannerStyle = () => {
    if (variant === 'premium') {
      return 'bg-gradient-to-r from-constalib-blue to-blue-600 text-white';
    }
    return 'bg-constalib-light-blue border border-constalib-blue/20';
  };

  return (
    <Card className={`${getBannerStyle()} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium mb-2 opacity-80">
            PARTENAIRE RECOMMANDÉ
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {title}
            </h3>
            <p className="text-sm opacity-90 mb-3">
              {description}
            </p>
            <Button 
              variant={variant === 'premium' ? 'secondary' : 'default'}
              size="sm"
              onClick={handleClick}
            >
              {ctaText}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdBanner;
