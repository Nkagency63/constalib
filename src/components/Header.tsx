
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, FileText, MapPin, Home } from 'lucide-react';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Navigation links
  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Déclarer un accident', path: '/accident', icon: <FileText className="w-5 h-5 mr-2" /> },
    { name: 'Carrossiers', path: '/repair-shops', icon: <MapPin className="w-5 h-5 mr-2" /> },
    { name: 'Mon Profil', path: '/profile', icon: <User className="w-5 h-5 mr-2" /> },
  ];

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-constalib-blue font-bold text-2xl tracking-tight">Constalib</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center text-sm font-medium transition-colors hover:text-constalib-blue ${
                location.pathname === link.path
                  ? 'text-constalib-blue'
                  : 'text-constalib-dark-gray'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button>
            Connexion
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-constalib-dark" />
          ) : (
            <Menu className="h-6 w-6 text-constalib-dark" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white z-40 animate-fade-in">
          <nav className="flex flex-col p-6 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center text-lg font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-constalib-blue'
                    : 'text-constalib-dark-gray'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Button className="w-full mt-4">
              Connexion
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
