
import { useState, useEffect } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';
import { downloadPDF } from '@/utils/downloadUtils';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface PdfPreviewModalProps {
  onClose: () => void;
  pdfUrl: string;
  fallbackUrl?: string;
}

const PdfPreviewModal = ({ onClose, pdfUrl, fallbackUrl }: PdfPreviewModalProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [displayUrl, setDisplayUrl] = useState('');
  
  useEffect(() => {
    const checkAndLoadPdf = async () => {
      setLoading(true);
      setError(false);
      
      // Try first URL
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (response.ok) {
          setDisplayUrl(pdfUrl);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error checking local PDF:', err);
      }
      
      // If first URL fails and we have a fallback that's a Supabase URL
      if (fallbackUrl && fallbackUrl.startsWith('storage:')) {
        try {
          // Parse the storage path
          const storagePath = fallbackUrl.substring(8);
          const slashIndex = storagePath.indexOf('/');
          
          if (slashIndex === -1) {
            throw new Error('Invalid storage path format');
          }
          
          const bucketName = storagePath.substring(0, slashIndex);
          const filePath = storagePath.substring(slashIndex + 1);
          
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
          
          if (publicUrlData && publicUrlData.publicUrl) {
            // Check if the file exists
            const response = await fetch(publicUrlData.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              setDisplayUrl(publicUrlData.publicUrl);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Error checking Supabase PDF:', err);
        }
      }
      
      // If all attempts fail
      setError(true);
      setLoading(false);
    };
    
    checkAndLoadPdf();
  }, [pdfUrl, fallbackUrl]);
  
  const handleDownload = () => {
    if (fallbackUrl && fallbackUrl.startsWith('storage:')) {
      downloadPDF(fallbackUrl, 'constat_amiable_vierge.pdf');
    } else {
      downloadPDF(pdfUrl, 'constat_amiable_vierge.pdf');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Aperçu du constat amiable</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Télécharger"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-10 w-10 border-4 border-constalib-blue border-t-transparent rounded-full"></div>
              <span className="ml-3">Chargement du document...</span>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Document non disponible</h4>
              <p className="text-gray-600 mb-4">
                Le document PDF n'a pas pu être chargé. Veuillez essayer de le télécharger directement.
              </p>
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-constalib-blue text-white rounded-md hover:bg-constalib-blue/90 transition-colors"
              >
                Télécharger le PDF
              </button>
            </div>
          )}
          
          {!loading && !error && displayUrl && (
            <iframe 
              src={`${displayUrl}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-0"
              title="Aperçu du constat amiable"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
