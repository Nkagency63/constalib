
/**
 * Utilitaires pour la génération et le téléchargement de PDF
 */

import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Génère un PDF à partir des données du constat
 * @param formData Données du formulaire de constat
 * @param schemeImageDataUrl Image du schéma (optionnel)
 * @returns URL de données du PDF généré
 */
export async function generatePDF(formData: any, schemeImageDataUrl?: string | null): Promise<string> {
  try {
    const pdfBytes = await generateCerfaPdf(formData, schemeImageDataUrl);
    return `data:application/pdf;base64,${arrayBufferToBase64(pdfBytes.buffer)}`;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Impossible de générer le PDF');
  }
}

/**
 * Télécharge le PDF généré
 * @param pdfUrl URL de données du PDF à télécharger
 * @param fileName Nom du fichier PDF
 * @returns Promise indiquant si le téléchargement a réussi
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

/**
 * Génère un PDF Cerfa à partir des données du constat
 * @param formData Données du formulaire
 * @param schemeImage Image du schéma en base64 (optionnel)
 * @param signatureImage Image de signature en base64 (optionnel)
 * @returns Tableau d'octets du PDF généré
 */
export async function generateCerfaPdf(formData: any, schemeImage?: string | null, signatureImage?: string | null): Promise<Uint8Array> {
  const existingPdfBytes = await fetch('/assets/pdf/constat-amiable-vierge.pdf').then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Structure des données formData adaptée à notre application
  const conducteurA = formData.driverInfo?.A || {};
  const vehiculeA = formData.vehicleLabels?.A || {};
  const accident = {
    lieu: formData.location || '',
    date: formData.date || '',
    time: formData.time || ''
  };
  const circonstances = formData.vehicleACircumstances || [];

  // Informations du conducteur A
  firstPage.drawText(conducteurA.name || 'NOM TEST', {
    x: 70,
    y: 680,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(conducteurA.address || 'ADRESSE TEST', {
    x: 70,
    y: 665,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Informations du véhicule A
  firstPage.drawText(vehiculeA.brand || 'Marque', {
    x: 70,
    y: 580,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(vehiculeA.model || 'Modèle', {
    x: 200,
    y: 580,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(vehiculeA.licensePlate || 'Immatriculation', {
    x: 70,
    y: 550,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Informations de l'accident
  firstPage.drawText(accident.lieu || 'Lieu', {
    x: 70,
    y: 460,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Format de date adaptée
  const formattedDate = formatDate(accident.date);
  firstPage.drawText(formattedDate || '20/05/2025', {
    x: 200,
    y: 460,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(accident.time || '12:00', {
    x: 300,
    y: 460,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Cocher les cases des circonstances (numéros de 1 à 17)
  circonstances.forEach((circ: any) => {
    const circId = typeof circ === 'string' ? circ : (circ as any).id;
    const num = parseInt(circId);
    if (num >= 1 && num <= 17) {
      const checkboxX = 65 + ((num - 1) % 2) * 240; // 2 colonnes
      const checkboxY = 400 - Math.floor((num - 1) / 2) * 20;
      firstPage.drawText('X', {
        x: checkboxX,
        y: checkboxY,
        size: 12,
        font,
        color: rgb(1, 0, 0),
      });
    }
  });

  // Intégrer une image de schéma si fournie (Konva exportée en base64)
  if (schemeImage) {
    try {
      const base64Data = schemeImage.split(',')[1];
      const pngImageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      firstPage.drawImage(pngImage, {
        x: 320,
        y: 150,
        width: 200,
        height: 150,
      });
    } catch (error) {
      console.error('Erreur lors de l\'intégration du schéma:', error);
    }
  }

  // Intégrer une image de signature si fournie (base64)
  if (signatureImage) {
    try {
      const base64Data = signatureImage.split(',')[1];
      const sigImageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const sigImage = await pdfDoc.embedPng(sigImageBytes);
      firstPage.drawImage(sigImage, {
        x: 100,
        y: 120,
        width: 100,
        height: 40,
      });
    } catch (error) {
      console.error('Erreur lors de l\'intégration de la signature:', error);
    }
  }

  return await pdfDoc.save();
}

// Fonction pour formater une date au format français
function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateStr || '';
  }
}

// Fonction pour convertir un ArrayBuffer en chaîne Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}
