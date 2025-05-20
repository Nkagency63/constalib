
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';

/**
 * Génère un PDF à partir des données du constat
 * @param formData Données du formulaire de constat
 * @returns URL de données du PDF généré
 */
export async function generatePDF(formData: any, schemeImageDataUrl?: string | null): Promise<string> {
  // Utilise la fonction existante de cerfa.ts pour la génération
  const { generateCerfaPDF } = await import('./cerfa');
  return generateCerfaPDF(formData, schemeImageDataUrl);
}

/**
 * Télécharge le PDF généré
 * @param pdfUrl URL de données du PDF à télécharger
 * @param fileName Nom du fichier PDF
 */
export async function downloadPDF(pdfUrl: string, fileName: string = 'constat-amiable.pdf'): Promise<boolean> {
  try {
    // Convertir l'URL de données en blob
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    
    // Télécharger le blob en tant que fichier
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    throw new Error('Impossible de télécharger le PDF');
  }
}
