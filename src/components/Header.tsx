
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleUser, Menu, Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-constalib-light-gray py-3 md:py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="font-bold text-lg md:text-xl text-constalib-blue">
            Consta<span className="text-constalib-dark">lib</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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
          <Button variant="ghost" size="icon" className="text-constalib-dark-gray hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-constalib-dark-gray hidden md:flex">
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-constalib-dark-gray">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[385px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-xl font-bold text-constalib-blue">
                  Consta<span className="text-constalib-dark">lib</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-6">
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
                  <SheetClose asChild>
                    <Link to="/profile" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                      Mon profil
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="#pricing" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                      Tarifs
                    </a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="#contact" className="text-constalib-dark hover:text-constalib-blue transition-colors py-2 border-b border-constalib-light-gray">
                      Contact
                    </a>
                  </SheetClose>
                </nav>
                <div className="mt-8">
                  <Button className="w-full">
                    Déclarer un accident
                  </Button>
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
