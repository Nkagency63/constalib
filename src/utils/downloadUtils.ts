
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
        console.error('Invalid storage path format, falling back to local file');
        // Fallback to local file immediately
        triggerLocalDownload(filename);
        return;
      }
      
      const bucketName = storagePath.substring(0, slashIndex);
      const filePath = storagePath.substring(slashIndex + 1);
      
      console.log(`Attempting to download from Supabase: bucket=${bucketName}, path=${filePath}`);
      
      // First, try to get the public URL
      try {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        
        if (publicUrlData && publicUrlData.publicUrl) {
          console.log('Found public URL:', publicUrlData.publicUrl);
          triggerDownload(publicUrlData.publicUrl, filename);
          toast.success("Téléchargement réussi");
          return;
        }
      } catch (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        // Continue to try direct download
      }
      
      try {
        // Try to download the file directly
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(filePath);
        
        if (error || !data) {
          console.error('Error downloading file:', error);
          throw new Error(`Fichier non trouvé: ${error?.message || 'Erreur inconnue'}`);
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
        toast.warning("Impossible de récupérer le fichier depuis Supabase. Utilisation du fichier local...");
        
        // Fallback to local file if Supabase storage fails
        triggerLocalDownload(filename);
        return;
      }
    } else {
      // For regular URLs, download directly
      triggerDownload(url, filename);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error("Erreur lors du téléchargement du PDF. Tentative avec la version locale...");
    
    // Final fallback to local file
    triggerLocalDownload(filename);
  }
};

/**
 * Helper function to upload file to Supabase storage
 * @param file File to upload
 * @param bucketName Name of the bucket to upload to
 * @param filePath Path within the bucket to save the file
 * @returns Promise that resolves to the URL of the uploaded file
 */
export const uploadFileToStorage = async (file: File, bucketName: string, filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true, // Replace if exists
        contentType: file.type
      });
    
    if (error) {
      console.error('Error uploading file to Supabase:', error);
      toast.error("Erreur lors de l'upload du fichier");
      throw error;
    }
    
    toast.success("Fichier uploadé avec succès");
    return data.path;
  } catch (error) {
    console.error('Error in upload process:', error);
    toast.error("Erreur lors de l'upload du fichier");
    throw error;
  }
};

/**
 * Helper function to trigger download from local public folder
 */
const triggerLocalDownload = (filename: string) => {
  const localUrl = `/pdf/${filename}`;
  console.log(`Using local file for download: ${localUrl}`);
  triggerDownload(localUrl, filename);
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
