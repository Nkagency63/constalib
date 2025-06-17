
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-constalib-blue/5 to-constalib-light-blue/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-constalib-dark">
            Prêt à Créer Votre <span className="text-constalib-blue">Constat Amiable</span> en Ligne ?
          </h2>
          <p className="text-constalib-dark-gray text-lg mb-8">
            Déclarez votre accident automobile rapidement avec notre service de constat amiable numérique gratuit. 
            Créez votre profil conducteur pour sauvegarder vos informations et accélérer vos futures déclarations d'accident.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/accident">
              <Button size="lg">
                Créer mon Constat Amiable Gratuit
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="lg">
                Créer mon Profil Conducteur
              </Button>
            </Link>
          </div>
          
          {/* Informations SEO supplémentaires */}
          <div className="mt-12 text-sm text-constalib-dark-gray/80">
            <p className="mb-2">
              <strong>Constat amiable numérique</strong> reconnu par de nombreuses compagnies d'assurance auto françaises
            </p>
            <p className="mb-2">
              Compatible avec AXA, Maif, Macif, Groupama, Allianz, MMA, GMF et de nombreuses assurances véhicule
            </p>
            <p>
              <em>Service de constat amiable en ligne 100% gratuit • Transmission automatique • Conforme RGPD</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
