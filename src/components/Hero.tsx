
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Logo from './Logo';
import { Download, Eye } from 'lucide-react';
import { downloadPDF } from '@/utils/downloadUtils';
import { toast } from "sonner";
import { useState } from 'react';
import PdfPreviewModal from './home/PdfPreviewModal';

const Hero = () => {
  const [showPreview, setShowPreview] = useState(false);
  
  const handleDownloadConstat = () => {
    // Use Supabase storage path for the PDF file
    const storagePath = "storage:constat-amiable-vierge.pdf/constat_amiable_vierge.pdf";
    toast.info("Téléchargement du constat amiable en cours...");
    downloadPDF(storagePath, 'constat_amiable_vierge.pdf');
  };

  return (
    <div className="bg-gradient-to-b from-constalib-light-blue/30 to-white py-16 md:py-24 lg:py-32 mb-8 md:mb-16 mt-16 md:mt-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-constalib-dark mb-4 md:mb-6">
            Simplifiez vos déclarations d'accidents
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-constalib-dark-gray mb-6 md:mb-8 px-2">Constalib vous permet de déclarer facilement un accident et de transmettre les informations à votre assureur en quelques minutes seulement.</p>
          
          {/* Groupe de boutons principal (horizontaux sur desktop) */}
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
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto inline-flex items-center gap-2" 
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-5 h-5" />
              Voir le constat
            </Button>
          </div>
          
          {/* Bouton "En savoir plus" en dessous */}
          <div className="mt-3">
            <Link to="/about" className="w-full sm:w-auto inline-block">
              <Button variant="outline" size="lg" className="w-full">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {showPreview && (
        <PdfPreviewModal 
          onClose={() => setShowPreview(false)}
          pdfUrl="/pdf/constat_amiable_vierge.pdf"
          fallbackUrl="storage:constat-amiable-vierge.pdf/constat_amiable_vierge.pdf"
        />
      )}
    </div>
  );
};

export default Hero;
