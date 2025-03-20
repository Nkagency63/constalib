
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Logo from './Logo';

const Hero = () => {
  return <div className="bg-gradient-to-b from-constalib-light-blue/30 to-white py-16 md:py-24 lg:py-32 mb-8 md:mb-16 mt-16 md:mt-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-constalib-dark mb-4 md:mb-6">
            Simplifiez vos déclarations d'accidents
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-constalib-dark-gray mb-6 md:mb-8 px-2">Constalib vous permet de déclarer facilement un accident et de transmettre les informations à votre assureur en quelques minutes seulement.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link to="/accident" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Déclarer un accident
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto mt-3 sm:mt-0">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
