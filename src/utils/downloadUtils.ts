
/**
 * Utility functions for downloading files
 */

/**
 * Initiates download of a PDF file from the given URL
 * @param url URL of the PDF file to download
 * @param filename Name to give the downloaded file
 */
export const downloadPDF = (url: string, filename: string) => {
  // For external URLs, we need to fetch the file first
  if (url.startsWith('http')) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        triggerDownload(blobUrl, filename);
        // Clean up the blob URL after download
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
      })
      .catch(error => {
        console.error('Error downloading PDF:', error);
        alert('Erreur lors du téléchargement du PDF. Veuillez réessayer.');
      });
  } else {
    // For local files, we can download directly
    triggerDownload(url, filename);
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
