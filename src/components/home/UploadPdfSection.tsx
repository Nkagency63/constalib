
import { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFileToStorage } from '@/utils/downloadUtils';
import { toast } from "sonner";

const UploadPdfSection = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }
    
    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      // Upload the file to the constat-amiable-vierge.pdf bucket
      await uploadFileToStorage(file, 'constat-amiable-vierge.pdf', 'constat_amiable_vierge.pdf');
      setUploadSuccess(true);
      toast.success("Le constat amiable a été uploadé avec succès!");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Une erreur est survenue lors de l'upload du fichier");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <section className="py-8 bg-gray-50 rounded-lg mt-4">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-constalib-dark">
            Uploader un constat amiable dans Supabase
          </h2>
          <p className="text-constalib-dark-gray text-md mb-6">
            Choisissez le fichier PDF du constat amiable pour le téléverser dans le stockage Supabase.
          </p>
          
          <div className="flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer mb-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-constalib-blue transition-colors">
                {uploadSuccess ? (
                  <div className="flex flex-col items-center text-green-500">
                    <Check className="w-12 h-12 mb-3" />
                    <span>Fichier uploadé avec succès!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-constalib-dark-gray">
                    <Upload className="w-12 h-12 mb-3" />
                    <span>Cliquez ou glissez-déposez un fichier PDF ici</span>
                  </div>
                )}
              </div>
              <input 
                id="file-upload" 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            
            {isUploading && (
              <div className="flex items-center text-constalib-blue">
                <div className="animate-spin mr-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span>Upload en cours...</span>
              </div>
            )}
            
            <div className="mt-6 text-sm text-gray-500 bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                <span className="font-medium">Note importante:</span>
              </div>
              <p>
                Le fichier sera uploadé avec le nom "constat_amiable_vierge.pdf" dans le bucket "constat-amiable-vierge.pdf".
                Cela permettra à l'application de le récupérer automatiquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadPdfSection;
