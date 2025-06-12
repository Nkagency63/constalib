
// Données d'exemple pour les publicités
export const mockAds = {
  carrossiers: [
    {
      id: 'c1',
      type: 'carrossier' as const,
      title: 'Carrosserie Pro Paris',
      description: 'Réparation rapide et garantie. Devis gratuit en 24h.',
      imageUrl: '/lovable-uploads/076c70e7-8ab0-4280-a52d-8f4a2285ec80.png',
      rating: 4.8,
      price: 'Dès 150€',
      ctaText: 'Devis gratuit',
      link: 'https://example.com/carrosserie-pro'
    },
    {
      id: 'c2',
      type: 'carrossier' as const,
      title: 'Auto Réparations Express',
      description: 'Spécialiste toutes marques. Service de courtoisie inclus.',
      rating: 4.6,
      price: 'Dès 200€',
      ctaText: 'Prendre RDV',
      link: 'https://example.com/auto-reparations'
    }
  ],
  assureurs: [
    {
      id: 'a1',
      type: 'assureur' as const,
      title: 'AssurPlus',
      description: 'Jusqu\'à 30% d\'économies sur votre assurance auto.',
      imageUrl: '/lovable-uploads/ce3632de-8cea-4095-9745-72435eab8739.png',
      rating: 4.5,
      price: 'Dès 25€/mois',
      ctaText: 'Devis en ligne',
      link: 'https://example.com/assurplus'
    },
    {
      id: 'a2',
      type: 'assureur' as const,
      title: 'Sécuri-Auto',
      description: 'Protection complète et assistance 24h/24.',
      rating: 4.7,
      price: 'Dès 35€/mois',
      ctaText: 'Souscrire',
      link: 'https://example.com/securi-auto'
    }
  ],
  garagistes: [
    {
      id: 'g1',
      type: 'garagiste' as const,
      title: 'Garage Central',
      description: 'Entretien et réparation toutes marques. Pièces d\'origine.',
      rating: 4.4,
      price: 'Dès 80€',
      ctaText: 'Réserver',
      link: 'https://example.com/garage-central'
    }
  ],
  location: [
    {
      id: 'l1',
      type: 'location' as const,
      title: 'RentCar Express',
      description: 'Véhicule de remplacement immédiat. Livraison gratuite.',
      rating: 4.6,
      price: 'Dès 29€/jour',
      ctaText: 'Réserver',
      link: 'https://example.com/rentcar'
    },
    {
      id: 'l2',
      type: 'location' as const,
      title: 'Location Plus',
      description: 'Large choix de véhicules. Tarifs préférentiels.',
      rating: 4.3,
      price: 'Dès 35€/jour',
      ctaText: 'Voir offres',
      link: 'https://example.com/location-plus'
    }
  ]
};

export const bannerAds = [
  {
    title: 'AssurMax - Votre nouveau partenaire',
    description: 'Découvrez nos offres exclusives et économisez jusqu\'à 40% sur votre assurance auto.',
    imageUrl: '/lovable-uploads/ce3632de-8cea-4095-9745-72435eab8739.png',
    ctaText: 'Obtenir un devis',
    link: 'https://example.com/assurmax',
    variant: 'premium' as const
  }
];
