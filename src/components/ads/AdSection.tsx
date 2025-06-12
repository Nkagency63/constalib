
import React from 'react';
import AdSpace from './AdSpace';

interface Ad {
  id: string;
  type: 'carrossier' | 'assureur' | 'garagiste' | 'location';
  title: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  price?: string;
  ctaText: string;
  link: string;
}

interface AdSectionProps {
  title: string;
  ads: Ad[];
  maxAds?: number;
}

const AdSection = ({ title, ads, maxAds = 3 }: AdSectionProps) => {
  const displayAds = maxAds ? ads.slice(0, maxAds) : ads;

  if (displayAds.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-constalib-dark">
          {title}
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Publicité
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayAds.map((ad) => (
          <AdSpace
            key={ad.id}
            type={ad.type}
            title={ad.title}
            description={ad.description}
            imageUrl={ad.imageUrl}
            rating={ad.rating}
            price={ad.price}
            ctaText={ad.ctaText}
            link={ad.link}
          />
        ))}
      </div>
    </div>
  );
};

export default AdSection;
