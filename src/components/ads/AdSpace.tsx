
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';

interface AdSpaceProps {
  type: 'carrossier' | 'assureur' | 'garagiste' | 'location';
  title: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  price?: string;
  ctaText: string;
  link: string;
  sponsor?: boolean;
}

const AdSpace = ({
  type,
  title,
  description,
  imageUrl,
  rating,
  price,
  ctaText,
  link,
  sponsor = true
}: AdSpaceProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'carrossier': return 'border-orange-200 bg-orange-50';
      case 'assureur': return 'border-blue-200 bg-blue-50';
      case 'garagiste': return 'border-green-200 bg-green-50';
      case 'location': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`${getTypeColor()} border-2 transition-all hover:shadow-md cursor-pointer`} onClick={handleClick}>
      <CardContent className="p-4">
        {sponsor && (
          <div className="text-xs text-gray-500 mb-2 font-medium">
            SPONSORISÉ
          </div>
        )}
        
        <div className="flex items-start gap-3">
          {imageUrl && (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm text-constalib-dark truncate">
                {title}
              </h3>
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{rating}</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-constalib-dark-gray mb-2 line-clamp-2">
              {description}
            </p>
            
            <div className="flex items-center justify-between">
              {price && (
                <span className="text-sm font-semibold text-constalib-blue">
                  {price}
                </span>
              )}
              
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                {ctaText}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdSpace;
