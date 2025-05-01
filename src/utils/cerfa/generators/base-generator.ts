
/**
 * Base functionality for PDF generation
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FormData } from "@/components/accident/types";

/**
 * Core process for generating a PDF document with form data
 * @param pdfBytes PDF template bytes
 * @param formData Form data to fill
 * @param schemeImageDataUrl Optional scheme image
 * @returns URL to the generated PDF
 */
export async function processFormPDF(pdfBytes: ArrayBuffer, formData: FormData, schemeImageDataUrl: string | null): Promise<string> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  // Fill the PDF with data
  await fillBasicInfo(pdfDoc, formData);
  await fillVehicleInfo(pdfDoc, formData);
  await fillDescription(pdfDoc, formData);
  
  // Add scheme image if available
  if (schemeImageDataUrl) {
    await addSchemeToDocument(pdfDoc, schemeImageDataUrl);
  }
  
  // Generate the final document
  const pdfBytesModified = await pdfDoc.save();
  
  // Create a Blob and URL for download
  const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  console.log("Génération du PDF terminée avec succès");
  return url;
}

/**
 * Adds the scheme image to a new page in the PDF
 */
export async function addSchemeToDocument(pdfDoc: PDFDocument, schemeImageDataUrl: string) {
  try {
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
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
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  } catch (imageError) {
    console.error("Erreur lors de l'incorporation de l'image du schéma:", imageError);
  }
}

/**
 * Fills basic accident information in PDF
 */
export async function fillBasicInfo(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Date and time
  page.drawText(`${formData.date} à ${formData.time}`, {
    x: 155,
    y: height - 123,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  // Location
  page.drawText(formData.location, {
    x: 150,
    y: height - 152,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    maxWidth: 300
  });
}

/**
 * Fills vehicle information in PDF
 */
export async function fillVehicleInfo(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Vehicle A information
  page.drawText(formData.licensePlate, {
    x: 110,
    y: height - 240,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  page.drawText(`${formData.vehicleBrand} ${formData.vehicleModel}`, {
    x: 110,
    y: height - 270,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  if (formData.insuranceCompany) {
    page.drawText(formData.insuranceCompany, {
      x: 110,
      y: height - 300,
      size: fontSize,
      font: helveticaFont,
      color: textColor
    });
  }
  
  if (formData.insurancePolicy) {
    page.drawText(formData.insurancePolicy, {
      x: 110,
      y: height - 330,
      size: fontSize,
      font: helveticaFont,
      color: textColor
    });
  }
  
  // Vehicle B information
  if (formData.otherVehicle) {
    page.drawText(formData.otherVehicle.licensePlate || "", {
      x: 380,
      y: height - 240,
      size: fontSize,
      font: helveticaFont,
      color: textColor
    });
    
    if (formData.otherVehicle.brand && formData.otherVehicle.model) {
      page.drawText(`${formData.otherVehicle.brand} ${formData.otherVehicle.model}`, {
        x: 380,
        y: height - 270,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });
    }
    
    if (formData.otherVehicle.insuranceCompany) {
      page.drawText(formData.otherVehicle.insuranceCompany, {
        x: 380,
        y: height - 300,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });
    }
    
    if (formData.otherVehicle.insurancePolicy) {
      page.drawText(formData.otherVehicle.insurancePolicy, {
        x: 380,
        y: height - 330,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });
    }
  }
}

/**
 * Fills description and circumstances in PDF
 */
export async function fillDescription(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Accident description
  if (formData.description) {
    page.drawText(formData.description, {
      x: 130,
      y: height - 600,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
      maxWidth: 400,
      lineHeight: 15
    });
  }
  
  // Vehicle A circumstances
  if (formData.vehicleACircumstances && formData.vehicleACircumstances.length > 0) {
    formData.vehicleACircumstances.forEach((circumstance, index) => {
      if (index < 5) { // Limit number of circumstances shown
        page.drawText(`- ${circumstance}`, {
          x: 100,
          y: height - 450 - (index * 15),
          size: 8,
          font: helveticaFont,
          color: textColor
        });
      }
    });
  }
  
  // Vehicle B circumstances
  if (formData.vehicleBCircumstances && formData.vehicleBCircumstances.length > 0) {
    formData.vehicleBCircumstances.forEach((circumstance, index) => {
      if (index < 5) { // Limit number of circumstances shown
        page.drawText(`- ${circumstance}`, {
          x: 380,
          y: height - 450 - (index * 15),
          size: 8,
          font: helveticaFont,
          color: textColor
        });
      }
    });
  }
  
  // Witnesses
  if (formData.hasWitnesses && formData.witnesses && formData.witnesses.length > 0) {
    formData.witnesses.forEach((witness, index) => {
      if (index < 2) { // Limit number of witnesses shown
        page.drawText(`${witness.fullName} (${witness.phone})`, {
          x: 130,
          y: height - 680 - (index * 15),
          size: fontSize,
          font: helveticaFont,
          color: textColor
        });
      }
    });
  }
  
  // Date for signature
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR');
  page.drawText(formattedDate, {
    x: 130,
    y: height - 730,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
}
