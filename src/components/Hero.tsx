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
    const storagePath = "storage:constat-amiable-vierge.pdf/constat-amiable-vierge.pdf";
    toast.info("Téléchargement du constat amiable en cours...");
    downloadPDF(storagePath, 'constat-amiable-vierge.pdf');
  };
  const handleDownloadApp = () => {
    const platform = Capacitor.getPlatform();
    const iosAppUrl = "https://apps.apple.com/fr/app/constalib/id123456789";
    const androidAppUrl = "https://play.google.com/store/apps/details?id=app.lovable.ea057c0030534d378eb5ed039b59cdbb";
    if (platform === 'ios') {
      window.location.href = iosAppUrl;
    } else if (platform === 'android') {
      window.location.href = androidAppUrl;
    } else {
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
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Logo size="2xl" variant="full" />
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-constalib-dark mb-4 md:mb-6">
          <span className="text-constalib-blue">Constat Amiable</span> en Ligne Gratuit
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold text-constalib-dark-gray mb-6">
          Déclaration d'Accident Automobile Numérique • Transmission Automatique Assurance Auto
        </h2>
        
        <p className="text-base md:text-lg lg:text-xl text-constalib-dark-gray mb-6 md:mb-8 px-2">
          <strong>Constat amiable numérique</strong> pour déclarer votre accident de voiture en ligne. 
          Générez automatiquement votre constat amiable PDF et transmettez-le directement à votre compagnie d'assurance auto. 
          <em>
Service 100% gratuit et sécurisé</em>.
        </p>
        
        {/* Groupe de boutons principal */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-4">
          <Link to="/accident" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">Créer mon Constat Amiable en Ligne</Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto inline-flex items-center gap-2" onClick={handleDownloadConstat}>
            <Download className="w-5 h-5" />
            Télécharger Formulaire Constat Amiable PDF
          </Button>
        </div>
        
        {/* Boutons secondaires */}
        <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/about" className="w-full sm:w-auto inline-block">
            <Button variant="outline" size="lg" className="w-full">
              Comment Remplir un Constat Amiable
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto inline-flex items-center gap-2" onClick={handleDownloadApp}>
            <Smartphone className="w-5 h-5" />
            App Mobile Constat Amiable
          </Button>
        </div>
        
        {/* Avantages clés */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/70 rounded-lg p-4 border border-constalib-light-blue/30">
            <h3 className="font-semibold text-constalib-dark mb-2">✓ Constat Amiable Officiel</h3>
            <p className="text-constalib-dark-gray">Conforme à la réglementation française et accepté par toutes les assurances auto</p>
          </div>
          <div className="bg-white/70 rounded-lg p-4 border border-constalib-light-blue/30">
            <h3 className="font-semibold text-constalib-dark mb-2">✓ Service 100% Gratuit</h3>
            <p className="text-constalib-dark-gray">Aucun frais caché, création et téléchargement de votre constat amiable sans coût</p>
          </div>
          <div className="bg-white/70 rounded-lg p-4 border border-constalib-light-blue/30">
            <h3 className="font-semibold text-constalib-dark mb-2">✓ Transmission Instantanée</h3>
            <p className="text-constalib-dark-gray">Envoi automatique à votre assurance auto pour un traitement plus rapide</p>
          </div>
        </div>
        
        {/* Mots-clés SEO structurés */}
        <div className="mt-8 text-xs text-constalib-dark-gray/60 max-w-3xl mx-auto">
          <p className="leading-relaxed">
            <strong>Mots-clés :</strong> constat amiable, constat amiable en ligne, constat amiable numérique, constat amiable PDF, 
            formulaire constat amiable, constat amiable gratuit, déclaration accident voiture, e-constat, constat amiable automobile, 
            assurance auto, sinistre auto, accident route France, constat amiable en ligne, transmission assurance automatique
          </p>
        </div>
      </div>
    </div>
  </div>;
};
export default Hero;