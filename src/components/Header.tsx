
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleUser, Menu, Bell, X, FileText, Calendar, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-constalib-blue border-b border-constalib-light-blue py-3 md:py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2">
          <Logo variant="icon-only" size="sm" />
          <span className="text-white text-xl hidden sm:inline-block font-bold tracking-tight">Constalib</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-white hover:text-constalib-light-blue transition-colors">
            Accueil
          </Link>
          <Link to="/accident" className="text-white hover:text-constalib-light-blue transition-colors">
            Déclarer un accident
          </Link>
          {user && (
            <>
              <Link to="/documents" className="text-white hover:text-constalib-light-blue transition-colors">
                Mes Documents
              </Link>
              <Link to="/appointments" className="text-white hover:text-constalib-light-blue transition-colors">
                Mes Rendez-vous
              </Link>
            </>
          )}
          <Link to="#contact" className="text-white hover:text-constalib-light-blue transition-colors">
            Contact
          </Link>
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="text-white hidden md:flex">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hidden md:flex">
                    <CircleUser className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center w-full">
                      <CircleUser className="w-4 h-4 mr-2" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/documents" className="flex items-center w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Mes Documents
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/appointments" className="flex items-center w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Mes Rendez-vous
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/accident" className="flex items-center w-full">
                      Déclarer un accident
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="text-white hidden md:flex">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[385px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-xl font-bold text-constalib-blue flex items-center gap-2">
                  <Logo variant="icon-only" size="sm" />
                  <span>Constalib</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-6">
                {user && profile && (
                  <div className="mb-6 p-4 bg-constalib-light-blue rounded-lg">
                    <p className="font-medium text-constalib-dark">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-sm text-constalib-dark-gray">{profile.email}</p>
                  </div>
                )}
                
                <nav className="flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link to="/" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                      Accueil
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/accident" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                      Déclarer un accident
                    </Link>
                  </SheetClose>
                  {user && (
                    <>
                      <SheetClose asChild>
                        <Link to="/documents" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                          Mes Documents
                          <FileText className="h-4 w-4 inline ml-2" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/appointments" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                          Mes Rendez-vous
                          <Calendar className="h-4 w-4 inline ml-2" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/profile" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                          Mon profil
                        </Link>
                      </SheetClose>
                    </>
                  )}
                  <SheetClose asChild>
                    <a href="#contact" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                      Contact
                    </a>
                  </SheetClose>
                </nav>
                <div className="mt-8">
                  {user ? (
                    <Button className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/auth">
                        <Button className="w-full">
                          <LogIn className="w-4 h-4 mr-2" />
                          Se connecter
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
