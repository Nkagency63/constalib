
/**
 * Fallback PDF generator for when the official CERFA form is not available
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FormData } from '@/components/accident/types';

/**
 * Generates a placeholder PDF when the official CERFA can't be loaded
 * @param formData Form data to include in the PDF
 * @param schemeImageDataUrl Optional scheme image data URL
 * @returns Promise resolving to the URL of the generated PDF
 */
export const generatePlaceholderPDF = async (formData: FormData, schemeImageDataUrl: string | null = null): Promise<string> => {
  console.log("Génération du PDF de secours avec les données:", formData);
  
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add first page (main constat)
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Add header
    await addHeader(pdfDoc, page);
    
    // Add accident information
    await addAccidentInfo(pdfDoc, page, formData);
    
    // Add vehicle information
    await addVehicleInfo(pdfDoc, page, formData);
    
    // Add circumstances and description
    await addCircumstancesAndDescription(pdfDoc, page, formData);
    
    // Add scheme image if available
    if (schemeImageDataUrl) {
      await addSchemeImage(pdfDoc, schemeImageDataUrl);
    }
    
    // Generate the final document
    const pdfBytesModified = await pdfDoc.save();
    
    // Create a Blob and URL for download
    const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    console.log("Génération du PDF de secours terminée avec succès");
    return url;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF de secours:", error);
    throw new Error(`Erreur lors de la génération du PDF de secours: ${(error as Error).message}`);
  }
};

/**
 * Add header to the PDF
 */
async function addHeader(pdfDoc: PDFDocument, page: PDFPage) {
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  
  // Title
  page.drawText("CONSTAT AMIABLE D'ACCIDENT AUTOMOBILE", {
    x: 150,
    y: height - 50,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  // Disclaimer
  page.drawText("Document généré par Constalib.fr (Version de secours)", {
    x: 120,
    y: height - 80,
    size: 10,
    font: helveticaBold,
    color: rgb(0.5, 0, 0)
  });
  
  // Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1, 0)
  });
}

/**
 * Add accident information to the PDF
 */
async function addAccidentInfo(pdfDoc: PDFDocument, page: PDFPage, formData: FormData) {
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();
  
  // Date et heure
  page.drawText("DATE DE L'ACCIDENT", {
    x: 50,
    y: height - 120,
    size: 10,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(formData.date, {
    x: 50,
    y: height - 140,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  page.drawText("HEURE", {
    x: 180,
    y: height - 120,
    size: 10,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(formData.time, {
    x: 180,
    y: height - 140,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  // Lieu
  page.drawText("LIEU", {
    x: 50,
    y: height - 170,
    size: 10,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(formData.location, {
    x: 50,
    y: height - 190,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0),
    maxWidth: 300
  });
}

/**
 * Add vehicle information to the PDF
 */
async function addVehicleInfo(pdfDoc: PDFDocument, page: PDFPage, formData: FormData) {
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();
  
  // Section title
  page.drawText("IDENTIFICATION DES VÉHICULES", {
    x: 50,
    y: height - 230,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  // Vehicle A (left column)
  page.drawText("VÉHICULE A", {
    x: 60,
    y: height - 260,
    size: 10,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText("Immatriculation:", {
    x: 60,
    y: height - 280,
    size: 9,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(formData.licensePlate, {
    x: 160,
    y: height - 280,
    size: 9,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  page.drawText("Marque/Modèle:", {
    x: 60,
    y: height - 300,
    size: 9,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`${formData.vehicleBrand} ${formData.vehicleModel}`, {
    x: 160,
    y: height - 300,
    size: 9,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  if (formData.insuranceCompany) {
    page.drawText("Assurance:", {
      x: 60,
      y: height - 320,
      size: 9,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(formData.insuranceCompany, {
      x: 160,
      y: height - 320,
      size: 9,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
  
  if (formData.insurancePolicy) {
    page.drawText("N° Police:", {
      x: 60,
      y: height - 340,
      size: 9,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(formData.insurancePolicy, {
      x: 160,
      y: height - 340,
      size: 9,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
  
  // Vehicle B (right column)
  if (formData.otherVehicle) {
    page.drawText("VÉHICULE B", {
      x: 340,
      y: height - 260,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    page.drawText("Immatriculation:", {
      x: 340,
      y: height - 280,
      size: 9,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    page.drawText(formData.otherVehicle.licensePlate || "", {
      x: 440,
      y: height - 280,
      size: 9,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
    
    if (formData.otherVehicle.brand && formData.otherVehicle.model) {
      page.drawText("Marque/Modèle:", {
        x: 340,
        y: height - 300,
        size: 9,
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(`${formData.otherVehicle.brand} ${formData.otherVehicle.model}`, {
        x: 440,
        y: height - 300,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    }
    
    if (formData.otherVehicle.insuranceCompany) {
      page.drawText("Assurance:", {
        x: 340,
        y: height - 320,
        size: 9,
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(formData.otherVehicle.insuranceCompany, {
        x: 440,
        y: height - 320,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    }
    
    if (formData.otherVehicle.insurancePolicy) {
      page.drawText("N° Police:", {
        x: 340,
        y: height - 340,
        size: 9,
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(formData.otherVehicle.insurancePolicy, {
        x: 440,
        y: height - 340,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    }
  }
}

/**
 * Add circumstances and description to the PDF
 */
async function addCircumstancesAndDescription(pdfDoc: PDFDocument, page: PDFPage, formData: FormData) {
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();
  
  // Description
  page.drawText("DESCRIPTION DE L'ACCIDENT", {
    x: 50,
    y: height - 400,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  if (formData.description) {
    const descriptionLines = formData.description.split('\n');
    let yPosition = height - 430;
    
    for (const line of descriptionLines) {
      page.drawText(line, {
        x: 60,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0),
        maxWidth: 480
      });
      yPosition -= 15;
    }
  } else {
    page.drawText("Aucune description fournie.", {
      x: 60,
      y: height - 430,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
  
  // Circumstances
  page.drawText("CIRCONSTANCES", {
    x: 50,
    y: height - 490,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  // Vehicle A circumstances
  if (formData.vehicleACircumstances && formData.vehicleACircumstances.length > 0) {
    page.drawText("Véhicule A:", {
      x: 60,
      y: height - 520,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    let yPos = height - 540;
    formData.vehicleACircumstances.forEach((circumstance, index) => {
      if (index < 8) { // Limit to prevent overflowing the page
        page.drawText(`- ${circumstance}`, {
          x: 70,
          y: yPos,
          size: 9,
          font: helvetica,
          color: rgb(0, 0, 0),
          maxWidth: 180
        });
        yPos -= 15;
      }
    });
  }
  
  // Vehicle B circumstances
  if (formData.vehicleBCircumstances && formData.vehicleBCircumstances.length > 0) {
    page.drawText("Véhicule B:", {
      x: 340,
      y: height - 520,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    let yPos = height - 540;
    formData.vehicleBCircumstances.forEach((circumstance, index) => {
      if (index < 8) { // Limit to prevent overflowing the page
        page.drawText(`- ${circumstance}`, {
          x: 350,
          y: yPos,
          size: 9,
          font: helvetica,
          color: rgb(0, 0, 0),
          maxWidth: 180
        });
        yPos -= 15;
      }
    });
  }
  
  // Witnesses
  if (formData.hasWitnesses && formData.witnesses && formData.witnesses.length > 0) {
    page.drawText("TÉMOINS", {
      x: 50,
      y: height - 650,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    let witnessYPos = height - 670;
    formData.witnesses.forEach((witness, index) => {
      if (index < 3) { // Limit to prevent overflowing the page
        page.drawText(`${witness.fullName} (${witness.phone})`, {
          x: 60,
          y: witnessYPos,
          size: 9,
          font: helvetica,
          color: rgb(0, 0, 0)
        });
        witnessYPos -= 15;
      }
    });
  }
  
  // Signature line
  page.drawLine({
    start: { x: 50, y: height - 750 },
    end: { x: 250, y: height - 750 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("Signature", {
    x: 50,
    y: height - 765,
    size: 9,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  // Date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR');
  
  page.drawText(`Date: ${formattedDate}`, {
    x: 50,
    y: height - 790,
    size: 9,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  // Footer
  page.drawText("Document généré par Constalib.fr - Ce document est un modèle simplifié et ne remplace pas le constat officiel", {
    x: 50,
    y: 40,
    size: 8,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5)
  });
}

/**
 * Adds the scheme image to a new page in the PDF
 */
async function addSchemeImage(pdfDoc: PDFDocument, schemeImageDataUrl: string) {
  try {
    // Convert dataURL to Uint8Array
    const base64Data = schemeImageDataUrl.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Create a new page for the scheme
    const schemePage = pdfDoc.addPage();
    const { width: pageWidth, height: pageHeight } = schemePage.getSize();
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    schemePage.drawText("SCHÉMA DE L'ACCIDENT", {
      x: 50,
      y: pageHeight - 50,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    // Embed the image
    const image = await pdfDoc.embedPng(imageBytes);
    const { width: imgWidth, height: imgHeight } = image;
    
    // Calculate dimensions with margins
    const margin = 50;
    const maxImageWidth = pageWidth - (margin * 2);
    const maxImageHeight = pageHeight - 100 - margin; // 100px for title and space
    
    const imageRatio = imgWidth / imgHeight;
    let imageWidth = maxImageWidth;
    let imageHeight = imageWidth / imageRatio;
    
    // Adjust if image is too tall
    if (imageHeight > maxImageHeight) {
      imageHeight = maxImageHeight;
      imageWidth = imageHeight * imageRatio;
    }
    
    // Draw the image
    schemePage.drawImage(image, {
      x: margin + (maxImageWidth - imageWidth) / 2, // Center horizontally
      y: pageHeight - 100 - imageHeight, // Position under title
      width: imageWidth,
      height: imageHeight
    });
    
    // Add footer
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR');
    
    schemePage.drawText(`Schéma généré le ${formattedDate}`, {
      x: margin,
      y: margin - 20,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du schéma:", error);
  }
}

// TypeScript type alias for PDFPage
type PDFPage = ReturnType<typeof PDFDocument.prototype.addPage>;
