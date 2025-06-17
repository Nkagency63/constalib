
import { Camera, FileText, MapPin, Shield } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeaturesSection = () => {
  // Features data
  const features = [
    {
      icon: FileText,
      title: 'Déclaration accident simple et rapide',
      description: 'Remplissez votre constat amiable numérique en quelques étapes guidées pour votre assurance auto.',
      action: '/accident'
    },
    {
      icon: Camera,
      title: 'Photos accident et sinistre auto',
      description: 'Photographiez les dégâts véhicule et la scène de l\'accident directement depuis l\'application mobile.',
      action: '/accident'
    },
    {
      icon: MapPin,
      title: 'Carrossiers partenaires géolocalisés',
      description: 'Trouvez rapidement les carrossiers agréés assurance et garages de réparation automobile proches de vous.',
      action: '/carrossiers'
    },
    {
      icon: Shield,
      title: 'Données sécurisées RGPD',
      description: 'Vos informations personnelles et déclarations de sinistre sont entièrement protégées selon les normes européennes.',
      action: null
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-constalib-light-gray/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
            Fonctionnalités constat amiable
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
            Tout pour gérer votre accident automobile
          </h2>
          <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
            Constalib.fr propose une suite complète d'outils numériques pour simplifier la gestion de vos accidents de la route et la communication avec votre assurance auto.
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
                      {feature.title.includes('Carrossiers') ? 'Trouver un carrossier agréé' : 'Déclarer accident'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Section SEO avec mots-clés contextuels */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-constalib-dark mb-4">
              Service de déclaration d'accident automobile en France
            </h3>
            <p className="text-constalib-dark-gray text-sm leading-relaxed">
              Notre plateforme de constat amiable numérique permet aux conducteurs français de déclarer 
              rapidement leur sinistre auto, de transmettre les informations à leur compagnie d'assurance 
              véhicule, et de trouver des carrossiers partenaires pour la réparation automobile. 
              Service gratuit conforme aux exigences des assureurs français.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
