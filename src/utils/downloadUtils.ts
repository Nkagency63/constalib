
/**
 * Utility functions for downloading files
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Initiates download of a PDF file from the given URL or from Supabase storage
 * @param url URL of the PDF file to download (or storage path if starts with 'storage:')
 * @param filename Name to give the downloaded file
 */
export const downloadPDF = async (url: string, filename: string) => {
  try {
    // If URL is a storage path, get the file from Supabase
    if (url.startsWith('storage:')) {
      // Parse the storage path (format: storage:bucketName/path/to/file)
      const storagePath = url.substring(8); // Remove 'storage:' prefix
      const slashIndex = storagePath.indexOf('/');
      
      if (slashIndex === -1) {
        throw new Error('Invalid storage path format. Expected format: storage:bucketName/path/to/file');
      }
      
      const bucketName = storagePath.substring(0, slashIndex);
      const filePath = storagePath.substring(slashIndex + 1);
      
      console.log(`Attempting to download from Supabase: bucket=${bucketName}, path=${filePath}`);
      
      try {
        // Get file from storage and download it
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(filePath);
        
        if (error) {
          console.error('Supabase storage error:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Le fichier n\'a pas pu être récupéré');
        }
        
        // Create URL from the blob and trigger download
        const blobUrl = window.URL.createObjectURL(data);
        triggerDownload(blobUrl, filename);
        
        // Clean up the blob URL after download
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        
        toast.success("Téléchargement réussi");
        return;
      } catch (storageError) {
        console.error('Error downloading from Supabase:', storageError);
        toast.warning("Impossible de récupérer le fichier depuis Supabase. Tentative depuis le serveur local...");
        
        // Fallback to local file if Supabase storage fails
        const localUrl = `/pdf/${filename}`;
        console.log(`Falling back to local file: ${localUrl}`);
        triggerDownload(localUrl, filename);
        return;
      }
    } else {
      // For regular URLs, download directly
      triggerDownload(url, filename);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error("Erreur lors du téléchargement du PDF. Veuillez réessayer.");
  }
};

/**
 * Helper function to trigger the actual download
 */
const triggerDownload = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.setAttribute('target', '_blank');
  
  // Append to body, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
