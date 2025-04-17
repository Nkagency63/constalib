
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-constalib-light-gray py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <span className="text-constalib-blue font-bold text-2xl tracking-tight">Constalib.fr</span>
            <p className="text-constalib-dark-gray mt-4 max-w-xs">
              Simplifiez vos déclarations d'accident avec notre application intuitive et efficace.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-constalib-dark font-semibold mb-4">Application</h3>
              <ul className="space-y-2 text-constalib-dark-gray">
                <li><Link to="/" className="hover:text-constalib-blue">Accueil</Link></li>
                <li><Link to="/accident" className="hover:text-constalib-blue">Déclarer un accident</Link></li>
                <li><Link to="/profile" className="hover:text-constalib-blue">Mon profil</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-constalib-dark font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-constalib-dark-gray">
                <li><Link to="/documents" className="hover:text-constalib-blue">Mes Documents</Link></li>
                <li><Link to="/appointments" className="hover:text-constalib-blue">Mes Rendez-vous</Link></li>
                <li><a href="#" className="hover:text-constalib-blue">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-constalib-dark font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-constalib-dark-gray">
                <li><a href="#" className="hover:text-constalib-blue">Mentions légales</a></li>
                <li><a href="#" className="hover:text-constalib-blue">Confidentialité</a></li>
                <li><a href="#" className="hover:text-constalib-blue">CGU</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-constalib-light-gray text-center text-constalib-dark-gray text-sm">
          &copy; {new Date().getFullYear()} Constalib.fr. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
