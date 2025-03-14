
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-constalib-light-blue/30 to-white py-32 mb-16">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-constalib-dark mb-6">
            Simplifiez vos déclarations d'accidents
          </h1>
          <p className="text-xl text-constalib-dark-gray mb-8">
            Constalib vous permet de déclarer facilement un accident et de transmettre
            les informations à votre assureur en quelques minutes seulement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/accident">
              <Button size="lg" className="w-full sm:w-auto">
                Déclarer un accident
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
