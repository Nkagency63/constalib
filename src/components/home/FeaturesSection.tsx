
import { Camera, FileText, MapPin, Shield } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: 'Constat Amiable en Ligne Simplifié',
      description: 'Créez votre constat amiable numérique en suivant notre guide étape par étape. Interface intuitive pour tous.',
      action: '/accident'
    },
    {
      icon: Camera,
      title: 'Photos Accident et Dégâts Véhicule',
      description: 'Photographiez les dégâts de votre voiture et la scène d\'accident directement dans votre constat amiable.',
      action: '/accident'
    },
    {
      icon: MapPin,
      title: 'Carrossiers Agréés Assurance',
      description: 'Localisez rapidement les carrossiers partenaires et garages de réparation automobile agréés par votre assurance.',
      action: '/carrossiers'
    },
    {
      icon: Shield,
      title: 'Constat Amiable Sécurisé RGPD',
      description: 'Vos données personnelles et votre constat amiable sont protégés selon les normes européennes de sécurité.',
      action: null
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-constalib-light-gray/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
            Fonctionnalités Constat Amiable Numérique
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
            Tout pour Gérer Votre <span className="text-constalib-blue">Constat Amiable</span> Automobile
          </h2>
          <p className="text-constalib-dark-gray text-lg max-w-3xl mx-auto">
            Constalib.fr propose une suite complète d'outils numériques pour simplifier la création de votre constat amiable, 
            la gestion de vos accidents de la route et la communication avec votre compagnie d'assurance auto.
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
                      {feature.title.includes('Carrossiers') ? 'Trouver un carrossier agréé' : 'Créer mon constat amiable'}
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
              Service de Constat Amiable Numérique en France
            </h3>
            <p className="text-constalib-dark-gray text-sm leading-relaxed">
              Notre plateforme de <strong>constat amiable en ligne</strong> permet aux conducteurs français de créer 
              rapidement leur <strong>constat amiable numérique</strong>, de le transmettre à leur compagnie d'assurance 
              automobile, et de trouver des carrossiers partenaires agréés pour la réparation de leur véhicule. 
              Service de <strong>constat amiable gratuit</strong> conforme aux exigences légales françaises et accepté 
              par de nombreux assureurs auto (AXA, Maif, Macif, Groupama, Allianz, MMA, GMF).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
