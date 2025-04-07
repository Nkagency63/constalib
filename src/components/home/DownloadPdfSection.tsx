
import { Download, Upload } from 'lucide-react';
import Button from '@/components/Button';
import { downloadPDF, uploadFileToStorage } from '@/utils/downloadUtils';
import { toast } from "sonner";
import { useState } from 'react';
import UploadPdfSection from './UploadPdfSection';

const DownloadPdfSection = () => {
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadConstat = () => {
    // Use Supabase storage path for the PDF file
    const storagePath = "storage:constat-amiable-vierge.pdf/constat_amiable_vierge.pdf";
    toast.info("Téléchargement du constat amiable en cours...");
    downloadPDF(storagePath, 'constat_amiable_vierge.pdf');
  };

  const handleUploadConstat = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the file to the constat-amiable-vierge.pdf bucket
      await uploadFileToStorage(file, 'constat-amiable-vierge.pdf', 'constat_amiable_vierge.pdf');
      toast.success("Le constat amiable a été uploadé avec succès!");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Une erreur est survenue lors de l'upload du fichier");
    } finally {
      setIsUploading(false);
    }
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative">
              <Button 
                variant="secondary" 
                size="lg" 
                className="inline-flex items-center gap-2 w-full sm:w-auto"
                onClick={() => document.getElementById('file-upload-section')?.click()}
                disabled={isUploading}
              >
                <Upload className="w-5 h-5" />
                {isUploading ? 'Téléversement en cours...' : 'Téléverser un constat (PDF)'}
              </Button>
              <input 
                id="file-upload-section" 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleUploadConstat}
                disabled={isUploading}
              />
            </div>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="inline-flex items-center gap-2 w-full sm:w-auto"
              onClick={handleDownloadConstat}
            >
              <Download className="w-5 h-5" />
              Télécharger un constat vierge
            </Button>
          </div>
          
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
