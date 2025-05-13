import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { FormData } from '@/components/accident/types';

// Mapping function to convert circumstance IDs to their respective types
const mapCircumstanceIdToType = (id: string): string => {
  switch (id) {
    case '1': return 'Stationnement';
    case '2': return 'Quittait un stationnement';
    case '3': return 'Prenait un stationnement';
    case '4': return 'Sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre';
    case '5': return 'S\'engageait sur un rond-point';
    case '6': return 'Circulait sur un rond-point';
    case '7': return 'N\'avait pas observé un signal de priorité';
    case '8': return 'Franchissait une ligne continue';
    case '9': return 'Venait de droite';
    case '10': return 'Reculait';
    case '11': return 'Changeait de file';
    case '12': return 'Dépassait';
    case '13': return 'Tournait à droite';
    case '14': return 'Tournait à gauche';
    case '15': return 'Freinait';
    case '16': return 'Heurtait à l\'arrière en circulant';
    case '17': return 'Empiétait sur une voie réservée';
    default: return 'Non spécifié';
  }
};

const addCircumstancesToPdf = async (pdfDoc: PDFDocument, page: PDFPage, formData: FormData) => {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();

  // Add circumstances for vehicle A
  if (formData.vehicleACircumstances?.length) {
    formData.vehicleACircumstances.forEach(circ => {
      try {
        // Handle both string and Circumstance object
        const circId = typeof circ === 'string' ? circ : circ.id;
        const circumstanceType = mapCircumstanceIdToType(circId);
        
        // Find the index of the circumstance and draw 'X' at the appropriate position
        const circIndex = parseInt(circId);
        if (!isNaN(circIndex) && circIndex >= 1 && circIndex <= 17) {
          const y = height - 430 - (circIndex - 1) * 15;
          page.drawText('X', {
            x: 115,
            y,
            size: 10,
            font: helveticaBold,
          });
        }
      } catch (error) {
        console.error('Error adding vehicle A circumstance:', error);
      }
    });
  }

  // Add circumstances for vehicle B
  if (formData.vehicleBCircumstances?.length) {
    formData.vehicleBCircumstances.forEach(circ => {
      try {
        // Handle both string and Circumstance object
        const circId = typeof circ === 'string' ? circ : circ.id;
        const circumstanceType = mapCircumstanceIdToType(circId);
        
        // Find the index of the circumstance and draw 'X' at the appropriate position
        const circIndex = parseInt(circId);
        if (!isNaN(circIndex) && circIndex >= 1 && circIndex <= 17) {
          const y = height - 430 - (circIndex - 1) * 15;
          page.drawText('X', {
            x: 475,
            y,
            size: 10,
            font: helveticaBold,
          });
        }
      } catch (error) {
        console.error('Error adding vehicle B circumstance:', error);
      }
    });
  }
};

export const addPlaceholderDataToPdf = async (pdfDoc: PDFDocument, formData: FormData) => {
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add accident details
  page.drawText(formData.date || 'Date inconnue', {
    x: 140,
    y: height - 125,
    size: 10,
    font: helveticaFont,
    color: rgb(0.98, 0.25, 0.27),
  });

  page.drawText(formData.time || 'Heure inconnue', {
    x: 140,
    y: height - 140,
    size: 10,
    font: helveticaFont,
    color: rgb(0.98, 0.25, 0.27),
  });

  page.drawText(formData.location || 'Lieu inconnu', {
    x: 140,
    y: height - 155,
    size: 9,
    font: helveticaFont,
    maxWidth: 200,
    color: rgb(0.98, 0.25, 0.27),
  });

  // Add driver A details
  const driverA = formData.driverInfo?.A;
  if (driverA) {
    page.drawText(driverA.name || 'Nom inconnu', {
      x: 70,
      y: height - 250,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });

    page.drawText(driverA.address || 'Adresse inconnue', {
      x: 70,
      y: height - 270,
      size: 8,
      font: helveticaFont,
      maxWidth: 150,
      color: rgb(0.98, 0.25, 0.27),
    });

    page.drawText(driverA.licenseNumber || 'Numéro de permis inconnu', {
      x: 70,
      y: height - 290,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });
  }

  // Add driver B details
  const driverB = formData.driverInfo?.B;
  if (driverB) {
    page.drawText(driverB.name || 'Nom inconnu', {
      x: 430,
      y: height - 250,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });

    page.drawText(driverB.address || 'Adresse inconnue', {
      x: 430,
      y: height - 270,
      size: 8,
      font: helveticaFont,
      maxWidth: 150,
      color: rgb(0.98, 0.25, 0.27),
    });

    page.drawText(driverB.licenseNumber || 'Numéro de permis inconnu', {
      x: 430,
      y: height - 290,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });
  }

  // Add vehicle A details
  const vehicleA = formData.vehicleLabels?.A;
  if (vehicleA) {
    page.drawText(`${vehicleA.brand || 'Marque inconnue'} ${vehicleA.model || 'Modèle inconnu'}`, {
      x: 70,
      y: height - 350,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });

    page.drawText(vehicleA.licensePlate || 'Plaque d\'immatriculation inconnue', {
      x: 70,
      y: height - 370,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });
  }

  // Add vehicle B details
  const vehicleB = formData.vehicleLabels?.B;
  if (vehicleB) {
    page.drawText(`${vehicleB.brand || 'Marque inconnue'} ${vehicleB.model || 'Modèle inconnu'}`, {
      x: 430,
      y: height - 350,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });

    page.drawText(vehicleB.licensePlate || 'Plaque d\'immatriculation inconnue', {
      x: 430,
      y: height - 370,
      size: 8,
      font: helveticaFont,
      color: rgb(0.98, 0.25, 0.27),
    });
  }

  // Add circumstances
  await addCircumstancesToPdf(pdfDoc, page, formData);
};
