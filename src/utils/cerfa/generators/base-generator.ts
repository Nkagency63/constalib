
/**
 * Base functionality for PDF generation
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FormData } from "@/components/accident/types";

/**
 * Core process for generating a PDF document with form data
 * @param pdfBytes PDF template bytes
 * @param formData Form data to fill
 * @param schemeImageDataUrl Optional scheme image data URL
 * @returns Promise resolving to the URL of the generated PDF
 */
export async function processFormPDF(pdfBytes: ArrayBuffer, formData: FormData, schemeImageDataUrl: string | null): Promise<string> {
  console.log("Starting PDF processing with data:", { 
    date: formData.date,
    time: formData.time,
    vehiclePlate: formData.licensePlate,
    otherVehiclePlate: formData.otherVehicle?.licensePlate,
    hasCircumstances: formData.vehicleACircumstances?.length > 0
  });
  
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  console.log("PDF loaded successfully, starting to fill data");
  
  // Fill the PDF with data
  await fillBasicInfo(pdfDoc, formData);
  await fillVehicleInfo(pdfDoc, formData);
  await fillDescription(pdfDoc, formData);
  await fillCircumstances(pdfDoc, formData);
  
  // Add scheme image if available
  if (schemeImageDataUrl) {
    console.log("Scheme image available, adding to PDF");
    await addSchemeToDocument(pdfDoc, schemeImageDataUrl);
  } else {
    console.log("No scheme image available");
  }
  
  // Generate the final document
  console.log("Finalizing PDF document");
  const pdfBytesModified = await pdfDoc.save();
  
  // Create a Blob and URL for download
  const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  console.log("PDF generation completed successfully");
  return url;
}

/**
 * Adds the scheme image to a new page in the PDF
 */
export async function addSchemeToDocument(pdfDoc: PDFDocument, schemeImageDataUrl: string) {
  try {
    console.log("Starting scheme image integration");
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
    let image;
    try {
      console.log("Attempting to embed image as PNG");
      image = await pdfDoc.embedPng(imageBytes);
    } catch (pngError) {
      console.error("Error embedding PNG image:", pngError);
      try {
        // Try as JPEG if PNG fails
        console.log("Attempting to embed image as JPEG");
        image = await pdfDoc.embedJpg(imageBytes);
      } catch (jpgError) {
        console.error("Error embedding JPG image:", jpgError);
        throw new Error("Unsupported image format");
      }
    }
    
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
    schemePage.drawText(`Scheme generated on ${formattedDate}`, {
      x: margin,
      y: margin - 20,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    console.log("Scheme image added to PDF successfully");
  } catch (imageError) {
    console.error("Error embedding scheme image:", imageError);
  }
}

/**
 * Fills basic accident information in PDF
 */
export async function fillBasicInfo(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  if (pages.length === 0) {
    console.error("No pages found in PDF");
    return;
  }
  
  const page = pages[0];
  const { width, height } = page.getSize();
  
  console.log("Page dimensions:", { width, height });
  
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Coordinates for specific form
  // Date and time - adjust these coordinates based on the official form
  console.log("Adding date and time:", formData.date, formData.time);
  page.drawText(`${formData.date || ""} ${formData.time || ""}`, {
    x: 275,
    y: height - 140,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  // Location
  console.log("Adding location:", formData.location);
  page.drawText(formData.location || "", {
    x: 275,
    y: height - 170,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    maxWidth: 300
  });
  
  // Injuries (yes/no)
  if (formData.hasInjuries) {
    page.drawText("X", {
      x: 275,
      y: height - 195,
      size: 12,
      font: helveticaFont,
      color: textColor
    });
  } else {
    page.drawText("X", {
      x: 310,
      y: height - 195,
      size: 12,
      font: helveticaFont,
      color: textColor
    });
  }
}

/**
 * Fills vehicle information in PDF
 */
export async function fillVehicleInfo(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  if (pages.length === 0) return;
  
  const page = pages[0];
  const { width, height } = page.getSize();
  
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // VEHICLE A
  console.log("Adding Vehicle A information:", formData.licensePlate);
  
  // License plate
  page.drawText(formData.licensePlate || "", {
    x: 170,
    y: height - 275,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  // Brand and model
  page.drawText(`${formData.vehicleBrand || ""} ${formData.vehicleModel || ""}`, {
    x: 170,
    y: height - 305,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  // Insurance company
  if (formData.insuranceCompany) {
    page.drawText(formData.insuranceCompany, {
      x: 170,
      y: height - 335,
      size: fontSize,
      font: helveticaFont,
      color: textColor
    });
  }
  
  // Policy number
  if (formData.insurancePolicy) {
    page.drawText(formData.insurancePolicy, {
      x: 170,
      y: height - 365,
      size: fontSize,
      font: helveticaFont,
      color: textColor
    });
  }
  
  // VEHICLE B
  console.log("Adding Vehicle B information:", formData.otherVehicle?.licensePlate);
  if (formData.otherVehicle) {
    // License plate
    page.drawText(formData.otherVehicle.licensePlate || "", {
      x: 455,
      y: height - 275,
      size: fontSize,
      font: helveticaFont,
      color: textColor
    });
    
    // Brand and model
    if (formData.otherVehicle.brand || formData.otherVehicle.model) {
      page.drawText(`${formData.otherVehicle.brand || ""} ${formData.otherVehicle.model || ""}`, {
        x: 455,
        y: height - 305,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });
    }
    
    // Insurance company
    if (formData.otherVehicle.insuranceCompany) {
      page.drawText(formData.otherVehicle.insuranceCompany, {
        x: 455,
        y: height - 335,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });
    }
    
    // Policy number
    if (formData.otherVehicle.insurancePolicy) {
      page.drawText(formData.otherVehicle.insurancePolicy, {
        x: 455,
        y: height - 365,
        size: fontSize,
        font: helveticaFont,
        color: textColor
      });
    }
  }
}

/**
 * Fills description in PDF
 */
export async function fillDescription(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  if (pages.length === 0) return;
  
  const page = pages[0];
  const { width, height } = page.getSize();
  
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Accident description
  if (formData.description) {
    console.log("Adding accident description");
    page.drawText(formData.description, {
      x: 200,
      y: height - 600,
      size: fontSize,
      font: helveticaFont,
      color: textColor,
      maxWidth: 220,
      lineHeight: 15
    });
  }
  
  // Witnesses
  if (formData.hasWitnesses && formData.witnesses && formData.witnesses.length > 0) {
    console.log("Adding witnesses");
    formData.witnesses.forEach((witness, index) => {
      if (index < 2) { // Limit number of witnesses displayed
        page.drawText(`${witness.fullName} (${witness.phone})`, {
          x: 200,
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
    x: 200,
    y: height - 730,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
}

/**
 * Fills circumstances in PDF
 */
export async function fillCircumstances(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  if (pages.length === 0) return;
  
  const page = pages[0];
  const { width, height } = page.getSize();
  
  const fontSize = 12;
  const textColor = rgb(0, 0, 0);
  
  // Vehicle A circumstances
  if (formData.vehicleACircumstances && formData.vehicleACircumstances.length > 0) {
    console.log("Adding Vehicle A circumstances:", formData.vehicleACircumstances);
    // Coordinates for checkboxes
    const circumstancesMap: Record<string, {x: number, y: number}> = {
      "stationary": { x: 110, y: height - 430 },
      "leaving_parking": { x: 110, y: height - 445 },
      "parking": { x: 110, y: height - 460 },
      "entering_parking": { x: 110, y: height - 475 },
      "entering_place": { x: 110, y: height - 490 },
      "leaving_place": { x: 110, y: height - 505 },
      "roundabout": { x: 110, y: height - 520 },
      "rear_collision": { x: 110, y: height - 535 },
      "same_direction": { x: 110, y: height - 550 },
      "changing_lanes": { x: 110, y: height - 565 },
      "overtaking": { x: 110, y: height - 580 },
      "turning_right": { x: 110, y: height - 595 },
      "turning_left": { x: 110, y: height - 610 },
      "reversing": { x: 110, y: height - 625 },
      "lane_violation": { x: 110, y: height - 640 },
      "right_turn": { x: 110, y: height - 655 },
      "ignored_priority": { x: 110, y: height - 670 }
    };
    
    // Mark circumstances with X
    formData.vehicleACircumstances.forEach(id => {
      if (circumstancesMap[id]) {
        page.drawText("X", {
          x: circumstancesMap[id].x,
          y: circumstancesMap[id].y,
          size: fontSize,
          font: helveticaFont,
          color: textColor
        });
      }
    });
  }
  
  // Vehicle B circumstances
  if (formData.vehicleBCircumstances && formData.vehicleBCircumstances.length > 0) {
    console.log("Adding Vehicle B circumstances:", formData.vehicleBCircumstances);
    // Coordinates for checkboxes, B side
    const circumstancesMap: Record<string, {x: number, y: number}> = {
      "stationary": { x: 540, y: height - 430 },
      "leaving_parking": { x: 540, y: height - 445 },
      "parking": { x: 540, y: height - 460 },
      "entering_parking": { x: 540, y: height - 475 },
      "entering_place": { x: 540, y: height - 490 },
      "leaving_place": { x: 540, y: height - 505 },
      "roundabout": { x: 540, y: height - 520 },
      "rear_collision": { x: 540, y: height - 535 },
      "same_direction": { x: 540, y: height - 550 },
      "changing_lanes": { x: 540, y: height - 565 },
      "overtaking": { x: 540, y: height - 580 },
      "turning_right": { x: 540, y: height - 595 },
      "turning_left": { x: 540, y: height - 610 },
      "reversing": { x: 540, y: height - 625 },
      "lane_violation": { x: 540, y: height - 640 },
      "right_turn": { x: 540, y: height - 655 },
      "ignored_priority": { x: 540, y: height - 670 }
    };
    
    // Mark circumstances with X
    formData.vehicleBCircumstances.forEach(id => {
      if (circumstancesMap[id]) {
        page.drawText("X", {
          x: circumstancesMap[id].x,
          y: circumstancesMap[id].y,
          size: fontSize,
          font: helveticaFont,
          color: textColor
        });
      }
    });
  }
  
  // Vehicle A impact points
  // Place X marks to indicate impact points (adjust based on available data)
  
  // Vehicle B impact points
  // Place X marks to indicate impact points (adjust based on available data)
}
