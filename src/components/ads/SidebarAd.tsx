
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SidebarAdProps {
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  link: string;
  backgroundColor?: string;
}

const SidebarAd = ({
  title,
  description,
  imageUrl,
  ctaText,
  link,
  backgroundColor = 'bg-gradient-to-br from-blue-50 to-indigo-100'
}: SidebarAdProps) => {
  const handleClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`${backgroundColor} border-0 shadow-sm sticky top-4`}>
      <CardContent className="p-4">
        <div className="text-xs text-gray-600 mb-2 font-medium">
          PUBLICITÉ
        </div>
        
        {imageUrl && (
          <div className="w-full h-20 rounded-lg overflow-hidden mb-3 bg-white">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h3 className="font-bold text-sm text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-xs text-gray-700 mb-3 leading-relaxed">
          {description}
        </p>
        
        <Button 
          size="sm" 
          className="w-full text-xs"
          onClick={handleClick}
        >
          {ctaText}
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SidebarAd;
