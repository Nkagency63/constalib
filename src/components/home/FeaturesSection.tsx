
import { Camera, FileText, MapPin, Shield } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeaturesSection = () => {
  // Features data
  const features = [
    {
      icon: FileText,
      title: 'Déclaration simple',
      description: 'Remplissez votre constat amiable numérique en quelques étapes guidées.',
      action: '/accident'
    },
    {
      icon: Camera,
      title: 'Ajout de photos',
      description: 'Photographiez les dégâts et la scène de l\'accident directement depuis l\'application.',
      action: '/accident'
    },
    {
      icon: MapPin,
      title: 'Localisation des carrossiers',
      description: 'Trouvez rapidement les carrossiers partenaires proches de vous.',
      action: '/carrossiers'
    },
    {
      icon: Shield,
      title: 'Données sécurisées',
      description: 'Vos informations personnelles et vos déclarations sont entièrement protégées.',
      action: null
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-constalib-light-gray/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
            Constalib.fr propose une suite complète d'outils pour simplifier la gestion de vos accidents de la route.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col h-full">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
              {feature.action && (
                <div className="mt-auto pt-4 flex justify-center">
                  <Link to={feature.action}>
                    <Button variant="outline" size="sm">
                      {feature.title === 'Localisation des carrossiers' ? 'Trouver un carrossier' : 'Accéder'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
