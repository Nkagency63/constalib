
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-constalib-blue/5 to-constalib-light-blue/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-constalib-dark">
            Prêt à simplifier vos déclarations d'accident automobile ?
          </h2>
          <p className="text-constalib-dark-gray text-lg mb-8">
            Créez votre profil conducteur dès maintenant et gagnez du temps lors de vos futures déclarations de sinistre auto. 
            Service gratuit pour tous les assurés en France.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile">
              <Button size="lg">
                Créer mon profil conducteur
              </Button>
            </Link>
            <Link to="/accident">
              <Button variant="outline" size="lg">
                Déclarer accident sans inscription
              </Button>
            </Link>
          </div>
          
          {/* Informations SEO supplémentaires */}
          <div className="mt-12 text-sm text-constalib-dark-gray/80">
            <p className="mb-2">
              <strong>Constat amiable numérique agréé</strong> par les principales compagnies d'assurance auto françaises
            </p>
            <p>
              Compatible avec AXA, Maif, Macif, Groupama, Allianz, MMA, GMF et toutes les assurances véhicule
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
