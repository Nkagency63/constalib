
import { Link } from 'react-router-dom';
import { CircleUser, Menu, Bell, GripVertical } from 'lucide-react';
import { Button } from './ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  return (
    <header className="bg-white border-b border-constalib-light-gray py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="font-bold text-xl text-constalib-blue">
            Consta<span className="text-constalib-dark">lib</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-constalib-dark hover:text-constalib-blue transition-colors">
            Accueil
          </Link>
          <Link to="/accident" className="text-constalib-dark hover:text-constalib-blue transition-colors">
            Déclarer un accident
          </Link>
          <a href="#pricing" className="text-constalib-dark hover:text-constalib-blue transition-colors">
            Tarifs
          </a>
          <a href="#contact" className="text-constalib-dark hover:text-constalib-blue transition-colors">
            Contact
          </a>
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-constalib-dark-gray">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-constalib-dark-gray">
                <CircleUser className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center w-full">
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/accident" className="flex items-center w-full">
                  Déclarer un accident
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden text-constalib-dark-gray">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
