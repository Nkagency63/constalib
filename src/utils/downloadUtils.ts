
/**
 * Utility functions for downloading files
 */

/**
 * Initiates download of a PDF file from the given URL
 * @param url URL of the PDF file to download
 * @param filename Name to give the downloaded file
 */
export const downloadPDF = (url: string, filename: string) => {
  // Create a direct link to download the file
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.setAttribute('target', '_blank');
  
  // Append to body, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
