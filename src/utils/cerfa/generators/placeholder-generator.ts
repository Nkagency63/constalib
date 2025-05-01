
/**
 * Fallback PDF generator when official template is not available
 */
import { FormData } from "@/components/accident/types";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { splitTextIntoLines } from "../pdf-utils";

/**
 * Generates a fallback PDF with form data when the template is unavailable
 * @param formData Form data to include in the PDF
 * @param schemeImageDataUrl Optional scheme image data URL
 * @returns Promise resolving to the URL of the generated PDF
 */
export async function generatePlaceholderPDF(formData: FormData, schemeImageDataUrl: string | null = null): Promise<string> {
  // Create a new blank PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 format
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  
  // Add a title
  page.drawText("CONSTAT AMIABLE D'ACCIDENT AUTOMOBILE", {
    x: 50,
    y: height - 50,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText("Généré par Constalib.fr", {
    x: 50,
    y: height - 70,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  // Add accident information
  await addAccidentInfo(pdfDoc, page, formData);
  
  // Add vehicle information
  await addVehicleInfo(pdfDoc, page, formData);
  
  // Add circumstances and description
  await addCircumstancesAndDescription(pdfDoc, page, formData);
  
  // Add the accident scheme if available
  if (schemeImageDataUrl) {
    await addSchemeImage(pdfDoc, schemeImageDataUrl);
  }
  
  // Add footer
  page.drawText("Ce document est un résumé généré automatiquement et ne remplace pas le constat amiable officiel.", {
    x: 50,
    y: 50,
    size: 8,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Generate the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  console.log("PDF de secours généré avec succès");
  return url;
}

/**
 * Add accident information to the PDF
 */
async function addAccidentInfo(pdfDoc: PDFDocument, page: PDFDocument.PDFPage, formData: FormData) {
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();
  
  page.drawText("INFORMATIONS SUR L'ACCIDENT", {
    x: 50,
    y: height - 120,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Date: ${formData.date}`, {
    x: 50,
    y: height - 150,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Heure: ${formData.time}`, {
    x: 50,
    y: height - 170,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Lieu: ${formData.location || formData.geolocation.address || "Non spécifié"}`, {
    x: 50,
    y: height - 190,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0),
    maxWidth: 400
  });
}

/**
 * Add vehicle information to the PDF
 */
async function addVehicleInfo(pdfDoc: PDFDocument, page: PDFDocument.PDFPage, formData: FormData) {
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();
  
  // Vehicle A
  page.drawText("VÉHICULE A (VOUS)", {
    x: 50,
    y: height - 240,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Immatriculation: ${formData.licensePlate || "Non spécifié"}`, {
    x: 50,
    y: height - 270,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Marque/Modèle: ${formData.vehicleBrand} ${formData.vehicleModel} (${formData.vehicleYear || "N/A"})`, {
    x: 50,
    y: height - 290,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  if (formData.insuranceCompany) {
    page.drawText(`Assurance: ${formData.insuranceCompany}`, {
      x: 50,
      y: height - 310,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
  
  if (formData.insurancePolicy) {
    page.drawText(`N° Police: ${formData.insurancePolicy}`, {
      x: 50,
      y: height - 330,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
  
  // Vehicle B
  page.drawText("VÉHICULE B (TIERS)", {
    x: 50,
    y: height - 380,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  page.drawText(`Immatriculation: ${formData.otherVehicle.licensePlate || "Non spécifié"}`, {
    x: 50,
    y: height - 410,
    size: 12,
    font: helvetica,
    color: rgb(0, 0, 0)
  });
  
  if (formData.otherVehicle.brand || formData.otherVehicle.model) {
    page.drawText(`Marque/Modèle: ${formData.otherVehicle.brand || ""} ${formData.otherVehicle.model || ""} (${formData.otherVehicle.year || "N/A"})`, {
      x: 50,
      y: height - 430,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
  
  if (formData.otherVehicle.insuranceCompany) {
    page.drawText(`Assurance: ${formData.otherVehicle.insuranceCompany}`, {
      x: 50,
      y: height - 450,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
  
  if (formData.otherVehicle.insurancePolicy) {
    page.drawText(`N° Police: ${formData.otherVehicle.insurancePolicy}`, {
      x: 50,
      y: height - 470,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });
  }
}

/**
 * Add circumstances and description to the PDF
 */
async function addCircumstancesAndDescription(pdfDoc: PDFDocument, page: PDFDocument.PDFPage, formData: FormData) {
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();
  
  // Circumstances
  page.drawText("CIRCONSTANCES", {
    x: 50,
    y: height - 520,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  if (formData.vehicleACircumstances && formData.vehicleACircumstances.length > 0) {
    page.drawText("Véhicule A:", {
      x: 50,
      y: height - 550,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    formData.vehicleACircumstances.forEach((circ, i) => {
      page.drawText(`- ${circ}`, {
        x: 60,
        y: height - 570 - (i * 20),
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    });
  }
  
  if (formData.vehicleBCircumstances && formData.vehicleBCircumstances.length > 0) {
    const yStart = height - 550 - (formData.vehicleACircumstances?.length * 20 || 0) - 40;
    
    page.drawText("Véhicule B:", {
      x: 50,
      y: yStart,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    formData.vehicleBCircumstances.forEach((circ, i) => {
      page.drawText(`- ${circ}`, {
        x: 60,
        y: yStart - 20 - (i * 20),
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    });
  }
  
  // Description
  if (formData.description) {
    const yStart = height - 550 - (formData.vehicleACircumstances?.length * 20 || 0) - 
                  (formData.vehicleBCircumstances?.length * 20 || 0) - 80;
    
    page.drawText("DESCRIPTION:", {
      x: 50,
      y: yStart,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    const descriptionLines = splitTextIntoLines(formData.description, 80);
    descriptionLines.forEach((line, i) => {
      page.drawText(line, {
        x: 50,
        y: yStart - 30 - (i * 20),
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    });
  }
}

/**
 * Add scheme image to a new page
 */
async function addSchemeImage(pdfDoc: PDFDocument, schemeImageDataUrl: string) {
  try {
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Convert dataURL to Uint8Array
    const base64Data = schemeImageDataUrl.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Create a new page for the scheme
    const schemePage = pdfDoc.addPage();
    const { width: schemeWidth, height: schemeHeight } = schemePage.getSize();
    
    // Add title
    schemePage.drawText("SCHÉMA DE L'ACCIDENT", {
      x: 50,
      y: schemeHeight - 50,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });
    
    // Embed the image
    const image = await pdfDoc.embedPng(imageBytes);
    
    // Calculate dimensions with margins
    const margin = 50;
    const maxImageWidth = schemeWidth - (margin * 2);
    const maxImageHeight = schemeHeight - 100 - margin; // 100px for title and space
    
    const imageRatio = image.width / image.height;
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
      y: schemeHeight - 100 - imageHeight, // Position under title
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
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5)
    });
  } catch (imageError) {
    console.error("Erreur lors de l'incorporation de l'image du schéma:", imageError);
  }
}
