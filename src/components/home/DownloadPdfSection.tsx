
import { Download } from 'lucide-react';
import Button from '@/components/Button';
import { downloadPDF } from '@/utils/downloadUtils';
import { toast } from "sonner";
import { useState } from 'react';
import UploadPdfSection from './UploadPdfSection';

const DownloadPdfSection = () => {
  const [showUploadSection, setShowUploadSection] = useState(false);

  const handleDownloadConstat = () => {
    // Use Supabase storage path for the PDF file
    const storagePath = "storage:constat-amiable-vierge.pdf/constat_amiable_vierge.pdf";
    toast.info("Téléchargement du constat amiable en cours...");
    downloadPDF(storagePath, 'constat_amiable_vierge.pdf');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-constalib-dark">
            Besoin d'un constat amiable papier ?
          </h2>
          <p className="text-constalib-dark-gray text-lg mb-8">
            Téléchargez un constat amiable vierge au format PDF à imprimer pour l'avoir toujours avec vous.
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="inline-flex items-center gap-2"
            onClick={handleDownloadConstat}
          >
            <Download className="w-5 h-5" />
            Télécharger un constat vierge (PDF)
          </Button>
          
          <div className="mt-8 pt-8 border-t border-gray-100">
            <button 
              className="text-sm text-gray-500 hover:text-constalib-blue transition-colors"
              onClick={() => setShowUploadSection(!showUploadSection)}
            >
              {showUploadSection ? "Masquer" : "Administration: Uploader un PDF"} 
            </button>
            
            {showUploadSection && <UploadPdfSection />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadPdfSection;
