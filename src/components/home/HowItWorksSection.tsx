
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Remplissez le constat',
      description: 'Suivez le guide étape par étape pour compléter votre constat amiable numérique.'
    },
    {
      step: '02',
      title: 'Ajoutez des photos',
      description: 'Prenez des photos des véhicules et des dommages directement dans l\'application.'
    },
    {
      step: '03',
      title: 'Envoyez à votre assureur',
      description: 'Transmettez automatiquement votre constat à votre compagnie d\'assurance.'
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
            Processus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
            Comment ça marche
          </h2>
          <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
            Un processus simple en quelques étapes pour vous aider à gérer efficacement votre déclaration d'accident.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-8 relative z-10 h-full shadow-sm border border-constalib-gray/20 hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-constalib-blue/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-constalib-dark">
                  {item.title}
                </h3>
                <p className="text-constalib-dark-gray">
                  {item.description}
                </p>
              </div>
              
              {/* Connector line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-constalib-light-gray transform translate-x-1/2 -translate-y-1/2 z-0" style={{ width: '50%' }}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/accident">
            <Button size="lg">
              Commencer une déclaration
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
