
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-constalib-light-blue rounded-bl-[100px] opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-constalib-light-blue rounded-tr-[70px] opacity-30" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium">
              Simplifiez vos déclarations d'accidents
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-constalib-dark leading-tight">
              Déclarez vos accidents <span className="text-constalib-blue">simplement</span> et <span className="text-constalib-blue">rapidement</span>
            </h1>
            
            <p className="text-constalib-dark-gray text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0">
              Constalib vous accompagne dans vos déclarations d'accidents avec une application intuitive et efficace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/accident">
                <Button size="lg" className="w-full sm:w-auto">
                  Déclarer un accident
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Créer un profil
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Image/Illustration */}
          <div className="md:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-tr from-constalib-blue/20 to-transparent z-10" />
              <div className="bg-constalib-light-blue w-full h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="glass-card p-6 rounded-xl max-w-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-constalib-blue/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-constalib-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Constat en ligne</h3>
                  <p className="text-constalib-dark-gray mb-4">
                    Remplissez votre constat en quelques étapes simples et partagez-le directement avec votre assureur.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-constalib-blue/10 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-constalib-blue/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
