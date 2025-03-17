
import { Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-constalib-light-gray/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-constalib-light-blue text-constalib-blue text-sm font-medium mb-4">
            Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-constalib-dark">
            Gérez tous vos besoins
          </h2>
          <p className="text-constalib-dark-gray text-lg max-w-2xl mx-auto">
            Constalib.fr vous permet de gérer tous les aspects liés à votre déclaration d'accident.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/documents" className="bg-white rounded-xl p-8 flex flex-col items-center text-center border border-constalib-gray/20 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-constalib-light-blue/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-constalib-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-constalib-dark">Mes Documents</h3>
            <p className="text-constalib-dark-gray">
              Accédez à tous vos documents de déclaration et suivez leur traitement par votre assureur.
            </p>
          </Link>
          
          <Link to="/appointments" className="bg-white rounded-xl p-8 flex flex-col items-center text-center border border-constalib-gray/20 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-constalib-light-blue/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-constalib-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-constalib-dark">Mes Rendez-vous</h3>
            <p className="text-constalib-dark-gray">
              Planifiez et gérez vos rendez-vous avec les experts et les carrossiers partenaires.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
