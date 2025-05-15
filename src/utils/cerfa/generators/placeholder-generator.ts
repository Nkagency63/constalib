
/**
 * Generates a placeholder PDF for cases when the official form is not available
 */
import { FormData } from "@/components/accident/types";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Creates a simple placeholder PDF with the essential accident information
 * @param formData Form data to include in the PDF
 * @returns Promise resolving to the URL of the generated PDF
 */
export const generatePlaceholderPDF = async (
  formData: FormData,
  schemeImageDataUrl: string | null = null,
  signatures?: {
    partyA?: string | null;
    partyB?: string | null;
  }
): Promise<string> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Get font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set text properties
    page.setFont(font);
    page.setFontSize(12);
    
    // Add title
    page.setFont(boldFont);
    page.setFontSize(24);
    page.drawText("CONSTAT AMIABLE D'ACCIDENT AUTOMOBILE", {
      x: 50,
      y: 800,
      color: rgb(0, 0, 0),
    });
    
    // Add date and time
    page.setFont(boldFont);
    page.setFontSize(14);
    page.drawText("Date et heure de l'accident:", {
      x: 50,
      y: 760,
      color: rgb(0, 0, 0),
    });
    
    page.setFont(font);
    page.setFontSize(12);
    page.drawText(`${formData.date} à ${formData.time}`, {
      x: 250,
      y: 760,
      color: rgb(0, 0, 0),
    });
    
    // Add location
    page.setFont(boldFont);
    page.setFontSize(14);
    page.drawText("Lieu:", {
      x: 50,
      y: 730,
      color: rgb(0, 0, 0),
    });
    
    page.setFont(font);
    page.setFontSize(12);
    page.drawText(formData.location, {
      x: 90,
      y: 730,
      color: rgb(0, 0, 0),
    });
    
    // Vehicle A information
    page.setFont(boldFont);
    page.setFontSize(16);
    page.drawText("VÉHICULE A", {
      x: 50,
      y: 680,
      color: rgb(0, 0, 0),
    });
    
    page.setFont(font);
    page.setFontSize(12);
    page.drawText(`Marque: ${formData.vehicleBrand || 'Non précisé'}`, {
      x: 50,
      y: 660,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Modèle: ${formData.vehicleModel || 'Non précisé'}`, {
      x: 50,
      y: 640,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Immatriculation: ${formData.licensePlate || 'Non précisé'}`, {
      x: 50,
      y: 620,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Compagnie d'assurance: ${formData.insuranceCompany || 'Non précisé'}`, {
      x: 50,
      y: 600,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`N° de police: ${formData.insurancePolicy || 'Non précisé'}`, {
      x: 50,
      y: 580,
      color: rgb(0, 0, 0),
    });
    
    // Vehicle B information
    page.setFont(boldFont);
    page.setFontSize(16);
    page.drawText("VÉHICULE B", {
      x: 350,
      y: 680,
      color: rgb(0, 0, 0),
    });
    
    page.setFont(font);
    page.setFontSize(12);
    page.drawText(`Marque: ${formData.otherVehicle.brand || 'Non précisé'}`, {
      x: 350,
      y: 660,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Modèle: ${formData.otherVehicle.model || 'Non précisé'}`, {
      x: 350,
      y: 640,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Immatriculation: ${formData.otherVehicle.licensePlate || 'Non précisé'}`, {
      x: 350,
      y: 620,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Compagnie d'assurance: ${formData.otherVehicle.insuranceCompany || 'Non précisé'}`, {
      x: 350,
      y: 600,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`N° de police: ${formData.otherVehicle.insurancePolicy || 'Non précisé'}`, {
      x: 350,
      y: 580,
      color: rgb(0, 0, 0),
    });
    
    // Description
    page.setFont(boldFont);
    page.setFontSize(14);
    page.drawText("Description:", {
      x: 50,
      y: 520,
      color: rgb(0, 0, 0),
    });
    
    page.setFont(font);
    page.setFontSize(12);
    
    // Split description into lines for better display
    const descriptionLines = splitTextIntoLines(formData.description || 'Aucune description fournie', 80);
    let lineY = 500;
    for (const line of descriptionLines) {
      page.drawText(line, {
        x: 50,
        y: lineY,
        color: rgb(0, 0, 0),
      });
      lineY -= 20;
    }
    
    // Add disclaimer
    page.setFont(font);
    page.setFontSize(10);
    page.drawText("Ce document est une version simplifiée du constat amiable. Le formulaire officiel n'étant pas disponible,", {
      x: 50,
      y: 100,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText("ce document reprend les informations essentielles pour la déclaration de votre sinistre.", {
      x: 50,
      y: 85,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Save document and create URL
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    
    return url;
  } catch (error) {
    console.error("Error generating placeholder PDF:", error);
    throw new Error(`Unable to generate placeholder PDF: ${error}`);
  }
};

/**
 * Splits text into lines with a maximum length
 * @param text Text to split
 * @param maxCharsPerLine Maximum characters per line
 * @returns Array of text lines
 */
function splitTextIntoLines(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine.length + word.length + 1) <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
