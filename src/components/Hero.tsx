
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Logo from './Logo';
import { Download, Eye } from 'lucide-react';
import { downloadPDF, uploadFileToStorage } from '@/utils/downloadUtils';
import { toast } from "sonner";
import { useState } from 'react';

const Hero = () => {
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

  return <div className="bg-gradient-to-b from-constalib-light-blue/30 to-white py-16 md:py-24 lg:py-32 mb-8 md:mb-16 mt-16 md:mt-20">
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
            <div className="relative w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto inline-flex items-center gap-2" 
                onClick={() => document.getElementById('file-upload-hero')?.click()}
                disabled={isUploading}
              >
                <Download className="w-5 h-5" />
                {isUploading ? 'Téléversement en cours...' : 'Télécharger un constat vierge (PDF)'}
              </Button>
              <input 
                id="file-upload-hero" 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleUploadConstat}
                disabled={isUploading}
              />
            </div>
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
    </div>;
};

export default Hero;
