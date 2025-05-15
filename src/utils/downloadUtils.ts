
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
    // If it's a blob URL (from in-memory generation), download directly
    if (url.startsWith('blob:')) {
      triggerDownload(url, filename);
      return;
    }
    
    // If URL is a storage path, get the file from Supabase
    if (url.startsWith('storage:')) {
      try {
        await downloadFromStorage(url, filename);
      } catch (storageError) {
        console.error('Error downloading from storage:', storageError);
        toast.warning("Impossible d'accéder au stockage. Utilisation du fichier local...");
        triggerLocalDownload(filename);
      }
      return;
    }
    
    // For regular URLs, try to download
    try {
      // Check if URL is accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        triggerDownload(url, filename);
      } else {
        console.error('File not accessible:', url);
        toast.warning("Le fichier n'est pas accessible. Utilisation du fichier local...");
        triggerLocalDownload(filename);
      }
    } catch (fetchError) {
      console.error('Error fetching URL:', fetchError);
      toast.warning("Le fichier n'est pas accessible. Utilisation du fichier local...");
      triggerLocalDownload(filename);
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error("Erreur lors du téléchargement du PDF. Utilisation de la version locale...");
    triggerLocalDownload(filename);
  }
};

/**
 * Downloads a file from Supabase storage
 * @param storagePath Storage path in format 'storage:bucketName/filePath'
 * @param filename Name to give the downloaded file
 */
async function downloadFromStorage(storagePath: string, filename: string) {
  // Parse the storage path (format: storage:bucketName/path/to/file)
  const path = storagePath.substring(8); // Remove 'storage:' prefix
  const slashIndex = path.indexOf('/');
  
  if (slashIndex === -1) {
    console.error('Invalid storage path format');
    throw new Error('Invalid storage path format');
  }
  
  const bucketName = path.substring(0, slashIndex);
  const filePath = path.substring(slashIndex + 1);
  
  console.log(`Downloading from Supabase: bucket=${bucketName}, path=${filePath}`);
  
  // Try to get a signed URL
  const { data: signedURL, error: signedURLError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60); // 60 seconds expiry
    
  if (signedURLError || !signedURL) {
    console.error('Error creating signed URL:', signedURLError);
    throw new Error(`Impossible de créer un lien de téléchargement`);
  }
  
  triggerDownload(signedURL.signedUrl, filename);
  toast.success("Téléchargement réussi");
}

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
      throw error;
    }
    
    toast.success("Fichier uploadé avec succès");
    return data.path;
  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
};

/**
 * Helper function to trigger download from local public folder
 */
const triggerLocalDownload = (filename: string) => {
  const localUrl = `/pdf/${filename.toLowerCase()}`;
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
