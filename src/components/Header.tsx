
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from './Button';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm border-b border-constalib-light-blue/20 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-constalib-dark hover:text-constalib-blue transition-colors"
            >
              À propos
            </Link>
            <Link 
              to="/blog" 
              className="text-constalib-dark hover:text-constalib-blue transition-colors"
            >
              Blog
            </Link>
            <Link 
              to="/carrossiers" 
              className="text-constalib-dark hover:text-constalib-blue transition-colors"
            >
              Carrossiers
            </Link>
            {user && (
              <>
                <Link 
                  to="/accident" 
                  className="text-constalib-dark hover:text-constalib-blue transition-colors"
                >
                  Déclarer un accident
                </Link>
                <Link 
                  to="/documents" 
                  className="text-constalib-dark hover:text-constalib-blue transition-colors"
                >
                  Documents
                </Link>
                <Link 
                  to="/appointments" 
                  className="text-constalib-dark hover:text-constalib-blue transition-colors"
                >
                  Rendez-vous
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile"
                  className="flex items-center space-x-2 text-constalib-dark hover:text-constalib-blue transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-constalib-dark hover:text-constalib-blue transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <Button>
                  Se connecter
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-constalib-dark hover:text-constalib-blue transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-constalib-light-blue/20">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-constalib-dark hover:text-constalib-blue transition-colors"
                onClick={closeMenu}
              >
                À propos
              </Link>
              <Link 
                to="/blog" 
                className="text-constalib-dark hover:text-constalib-blue transition-colors"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link 
                to="/carrossiers" 
                className="text-constalib-dark hover:text-constalib-blue transition-colors"
                onClick={closeMenu}
              >
                Carrossiers
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/accident" 
                    className="text-constalib-dark hover:text-constalib-blue transition-colors"
                    onClick={closeMenu}
                  >
                    Déclarer un accident
                  </Link>
                  <Link 
                    to="/documents" 
                    className="text-constalib-dark hover:text-constalib-blue transition-colors"
                    onClick={closeMenu}
                  >
                    Documents
                  </Link>
                  <Link 
                    to="/appointments" 
                    className="text-constalib-dark hover:text-constalib-blue transition-colors"
                    onClick={closeMenu}
                  >
                    Rendez-vous
                  </Link>
                  <Link 
                    to="/profile"
                    className="flex items-center space-x-2 text-constalib-dark hover:text-constalib-blue transition-colors"
                    onClick={closeMenu}
                  >
                    <User className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-constalib-dark hover:text-constalib-blue transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={closeMenu}>
                  <Button className="w-full">
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
