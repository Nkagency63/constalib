import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Logo from './Logo';
import { Download, Smartphone } from 'lucide-react';
import { downloadPDF } from '@/utils/downloadUtils';
import { toast } from "sonner";
import { useState } from 'react';
import { Capacitor } from '@capacitor/core';

const Hero = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleDownloadConstat = () => {
    // Use Supabase storage path for the PDF file
    const storagePath = "storage:constat-amiable-vierge.pdf/constat-amiable-vierge.pdf";
    toast.info("Téléchargement du constat amiable en cours...");
    downloadPDF(storagePath, 'constat-amiable-vierge.pdf');
  };

  const handleDownloadApp = () => {
    const platform = Capacitor.getPlatform();
    const iosAppUrl = "https://apps.apple.com/fr/app/constalib/id123456789"; // Remplacer par le vrai ID
    const androidAppUrl = "https://play.google.com/store/apps/details?id=app.lovable.ea057c0030534d378eb5ed039b59cdbb"; // URL Play Store

    if (platform === 'ios') {
      window.location.href = iosAppUrl;
    } else if (platform === 'android') {
      window.location.href = androidAppUrl;
    } else {
      // Sur desktop, on peut soit rediriger vers une page d'information
      // soit détecter le système d'exploitation pour suggérer le bon store
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('mac')) {
        window.location.href = iosAppUrl;
      } else if (userAgent.includes('android')) {
        window.location.href = androidAppUrl;
      } else {
        toast.info("Visitez l'App Store ou le Play Store sur votre mobile pour télécharger l'application");
      }
    }
  };

  return <div className="bg-gradient-to-b from-constalib-light-blue/30 to-white py-16 md:py-24 lg:py-32 mb-8 md:mb-16 mt-16 md:mt-20">
    <div className="container px-4 mx-auto">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Logo size="2xl" variant="full" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-constalib-dark mb-4 md:mb-6">
          Simplifiez vos déclarations d'accidents
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-constalib-dark-gray mb-6 md:mb-8 px-2">Constalib vous permet de déclarer facilement un accident et de transmettre les informations à votre assureur en quelques minutes seulement.</p>
        
        {/* Groupe de boutons principal */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-4">
          <Link to="/accident" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">Déclarer un accident en ligne</Button>
          </Link>
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full sm:w-auto inline-flex items-center gap-2" 
            onClick={handleDownloadConstat}
          >
            <Download className="w-5 h-5" />
            Télécharger un constat vierge (PDF)
          </Button>
        </div>
        
        {/* Boutons "En savoir plus" et mobile app */}
        <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/about" className="w-full sm:w-auto inline-block">
            <Button variant="outline" size="lg" className="w-full">
              En savoir plus
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto inline-flex items-center gap-2"
            onClick={handleDownloadApp}
          >
            <Smartphone className="w-5 h-5" />
            Télécharger l'application mobile
          </Button>
        </div>
      </div>
    </div>
  </div>;
};

export default Hero;
