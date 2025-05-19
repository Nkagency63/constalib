
import { FormData } from "@/components/accident/types";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { splitTextIntoLines } from '../pdf-utils';

/**
 * Generate a placeholder PDF when main generator fails
 * @param formData Form data for the accident report
 * @returns Promise resolving to a data URL for the generated PDF
 */
export async function generatePlaceholderPdf(formData: FormData): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page to the document
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  
  // Get the standard font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Define the margins
  const margin = 50;
  
  // Set the title of the page
  page.drawText('CONSTAT AMIABLE D\'ACCIDENT AUTOMOBILE', {
    x: margin,
    y: page.getHeight() - margin,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0, 0.8)
  });
  
  // Add a subtitle
  page.drawText('Formulaire d\'urgence - Remplace le CERFA 15757*03', {
    x: margin,
    y: page.getHeight() - margin - 20,
    size: 10,
    font: helveticaFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  // Draw a line
  page.drawLine({
    start: { x: margin, y: page.getHeight() - margin - 30 },
    end: { x: page.getWidth() - margin, y: page.getHeight() - margin - 30 },
    thickness: 1,
    color: rgb(0, 0, 0.7)
  });
  
  // Draw date and time information
  let currentY = page.getHeight() - margin - 60;
  page.drawText(`Date de l'accident : ${formData.date || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  currentY -= 20;
  page.drawText(`Heure : ${formData.time || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  currentY -= 20;
  page.drawText(`Lieu : ${formData.location || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  // Draw a section for vehicle A
  currentY -= 40;
  page.drawText('VÉHICULE A', {
    x: margin,
    y: currentY,
    size: 14,
    font: helveticaBold
  });
  
  currentY -= 25;
  page.drawText(`Marque : ${formData.vehicleBrand || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  currentY -= 20;
  page.drawText(`Modèle : ${formData.vehicleModel || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  currentY -= 20;
  page.drawText(`Immatriculation : ${formData.licensePlate || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  // Draw a section for vehicle B
  currentY -= 40;
  page.drawText('VÉHICULE B', {
    x: margin,
    y: currentY,
    size: 14,
    font: helveticaBold
  });
  
  currentY -= 25;
  page.drawText(`Marque : ${formData.otherVehicle?.brand || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  currentY -= 20;
  page.drawText(`Modèle : ${formData.otherVehicle?.model || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  currentY -= 20;
  page.drawText(`Immatriculation : ${formData.otherVehicle?.licensePlate || 'Non renseigné'}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: helveticaFont
  });
  
  // Add a disclaimer
  currentY -= 60;
  const disclaimer = "Ce document est un formulaire d'urgence simplifié. Pour un constat amiable officiel, veuillez utiliser le formulaire CERFA 15757*03.";
  
  // Split the disclaimer into multiple lines
  const disclaimerLines = splitTextIntoLines(disclaimer, 70);
  
  for (const line of disclaimerLines) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0, 0)
    });
    currentY -= 15;
  }
  
  // Serialize the PDF to bytes and create a data URL
  const pdfBytes = await pdfDoc.save();
  
  // Convert the bytes to a base64 string
  const base64 = btoa(
    new Uint8Array(pdfBytes).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
  
  // Create and return a data URL
  return `data:application/pdf;base64,${base64}`;
}
