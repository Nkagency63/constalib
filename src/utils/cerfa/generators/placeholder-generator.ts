
import { FormData } from "@/components/accident/types";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { addTextToPdf } from "../pdf-utils";

/**
 * Generates a placeholder PDF for testing or when full CERFA generation is not available
 */
export const generatePlaceholderPDF = async (
  formData: FormData, 
  schemeImageDataUrl: string | null = null,
  signatures?: { partyA: string | null; partyB: string | null }
): Promise<string> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    
    // Get a font to use for text
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    page.drawText("CONSTAT AMIABLE AUTOMOBILE", {
      x: 150,
      y: 800,
      size: 16,
      font: helveticaBold
    });
    
    // Add document information
    page.drawText("Document de simulation - NON OFFICIEL", {
      x: 150,
      y: 780,
      size: 12,
      font: helveticaFont,
      color: { r: 0.8, g: 0.2, b: 0.2 }
    });
    
    // Add accident date and time
    addTextToPdf(page, "Date de l'accident:", 50, 730, helveticaBold, 10);
    addTextToPdf(page, formData.date || "Non spécifié", 200, 730, helveticaFont, 10);
    
    addTextToPdf(page, "Heure:", 50, 710, helveticaBold, 10);
    addTextToPdf(page, formData.time || "Non spécifié", 200, 710, helveticaFont, 10);
    
    // Add location information
    addTextToPdf(page, "Lieu:", 50, 690, helveticaBold, 10);
    addTextToPdf(page, formData.geolocation?.address || "Non spécifié", 200, 690, helveticaFont, 10);
    
    // Add vehicle A information
    addTextToPdf(page, "VÉHICULE A", 50, 650, helveticaBold, 12);
    addTextToPdf(page, "Marque:", 50, 630, helveticaBold, 10);
    addTextToPdf(page, formData.vehicleBrand || "Non spécifié", 150, 630, helveticaFont, 10);
    
    addTextToPdf(page, "Modèle:", 50, 610, helveticaBold, 10);
    addTextToPdf(page, formData.vehicleModel || "Non spécifié", 150, 610, helveticaFont, 10);
    
    addTextToPdf(page, "Immatriculation:", 50, 590, helveticaBold, 10);
    addTextToPdf(page, formData.licensePlate || "Non spécifié", 150, 590, helveticaFont, 10);
    
    // Add vehicle B information
    addTextToPdf(page, "VÉHICULE B", 300, 650, helveticaBold, 12);
    addTextToPdf(page, "Marque:", 300, 630, helveticaBold, 10);
    addTextToPdf(page, formData.otherVehicle?.brand || "Non spécifié", 400, 630, helveticaFont, 10);
    
    addTextToPdf(page, "Modèle:", 300, 610, helveticaBold, 10);
    addTextToPdf(page, formData.otherVehicle?.model || "Non spécifié", 400, 610, helveticaFont, 10);
    
    addTextToPdf(page, "Immatriculation:", 300, 590, helveticaBold, 10);
    addTextToPdf(page, formData.otherVehicle?.licensePlate || "Non spécifié", 400, 590, helveticaFont, 10);
    
    // Add driver information for vehicle A
    addTextToPdf(page, "CONDUCTEUR A", 50, 550, helveticaBold, 12);
    addTextToPdf(page, "Nom:", 50, 530, helveticaBold, 10);
    addTextToPdf(page, formData.driverName || "Non spécifié", 150, 530, helveticaFont, 10);
    
    addTextToPdf(page, "Téléphone:", 50, 510, helveticaBold, 10);
    addTextToPdf(page, formData.driverPhone || "Non spécifié", 150, 510, helveticaFont, 10);
    
    // Add driver information for vehicle B
    addTextToPdf(page, "CONDUCTEUR B", 300, 550, helveticaBold, 12);
    addTextToPdf(page, "Nom:", 300, 530, helveticaBold, 10);
    addTextToPdf(page, formData.otherDriverName || "Non spécifié", 400, 530, helveticaFont, 10);
    
    addTextToPdf(page, "Téléphone:", 300, 510, helveticaBold, 10);
    addTextToPdf(page, formData.otherDriverPhone || "Non spécifié", 400, 510, helveticaFont, 10);
    
    // Add circumstances section
    addTextToPdf(page, "CIRCONSTANCES", 50, 470, helveticaBold, 12);
    
    // Add circumstance descriptions if available
    if (formData.circumstances && formData.circumstances.vehicleA) {
      let y = 450;
      addTextToPdf(page, "Véhicule A:", 50, y, helveticaBold, 10);
      y -= 20;
      
      formData.circumstances.vehicleA.forEach((circ, index) => {
        if (index < 5) { // Limit to 5 entries to prevent overflow
          addTextToPdf(page, `- ${circ.text || circ.id || "Circonstance"}`, 70, y, helveticaFont, 8);
          y -= 15;
        }
      });
    }
    
    if (formData.circumstances && formData.circumstances.vehicleB) {
      let y = 450;
      addTextToPdf(page, "Véhicule B:", 300, y, helveticaBold, 10);
      y -= 20;
      
      formData.circumstances.vehicleB.forEach((circ, index) => {
        if (index < 5) { // Limit to 5 entries to prevent overflow
          addTextToPdf(page, `- ${circ.text || circ.id || "Circonstance"}`, 320, y, helveticaFont, 8);
          y -= 15;
        }
      });
    }
    
    // Add description of damages
    addTextToPdf(page, "DESCRIPTION DES DOMMAGES", 50, 350, helveticaBold, 12);
    if (formData.materialDamageDescription) {
      const descriptionLines = formData.materialDamageDescription.split('\n');
      let y = 330;
      descriptionLines.forEach((line, index) => {
        if (index < 8) { // Limit number of lines
          addTextToPdf(page, line, 70, y, helveticaFont, 8);
          y -= 15;
        }
      });
    }
    
    // Add space for scheme image
    if (schemeImageDataUrl) {
      try {
        // Remove the data prefix
        const base64Data = schemeImageDataUrl.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '');
        // Convert base64 to bytes
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        let embeddedImage;
        if (schemeImageDataUrl.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }
        
        // Calculate dimensions to fit within the available space
        const imageWidth = embeddedImage.width;
        const imageHeight = embeddedImage.height;
        const maxWidth = 400;
        const maxHeight = 200;
        
        let width = imageWidth;
        let height = imageHeight;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        // Draw the scheme image
        page.drawImage(embeddedImage, {
          x: 100,
          y: 120,
          width,
          height,
        });
        
        addTextToPdf(page, "Schéma de l'accident", 50, 100, helveticaBold, 10);
      } catch (error) {
        console.error("Error embedding scheme image:", error);
        addTextToPdf(page, "Error embedding scheme image", 100, 150, helveticaFont, 10);
      }
    } else {
      addTextToPdf(page, "Aucun schéma disponible", 100, 150, helveticaFont, 10);
    }
    
    // Add signatures if available
    if (signatures) {
      addTextToPdf(page, "SIGNATURES", 50, 80, helveticaBold, 12);
      
      addTextToPdf(page, "Signature A:", 50, 60, helveticaBold, 10);
      if (signatures.partyA) {
        try {
          const signatureBytes = Uint8Array.from(
            atob(signatures.partyA.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '')),
            c => c.charCodeAt(0)
          );
          const embeddedSignature = await pdfDoc.embedPng(signatureBytes);
          page.drawImage(embeddedSignature, {
            x: 120,
            y: 40,
            width: 100,
            height: 40,
          });
        } catch (error) {
          console.error("Error embedding signature A:", error);
          addTextToPdf(page, "Signature électronique", 120, 50, helveticaFont, 8);
        }
      } else {
        addTextToPdf(page, "Non signé", 120, 50, helveticaFont, 8);
      }
      
      addTextToPdf(page, "Signature B:", 300, 60, helveticaBold, 10);
      if (signatures.partyB) {
        try {
          const signatureBytes = Uint8Array.from(
            atob(signatures.partyB.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '')),
            c => c.charCodeAt(0)
          );
          const embeddedSignature = await pdfDoc.embedPng(signatureBytes);
          page.drawImage(embeddedSignature, {
            x: 370,
            y: 40,
            width: 100,
            height: 40,
          });
        } catch (error) {
          console.error("Error embedding signature B:", error);
          addTextToPdf(page, "Signature électronique", 370, 50, helveticaFont, 8);
        }
      } else {
        addTextToPdf(page, "Non signé", 370, 50, helveticaFont, 8);
      }
    }
    
    // Save the PDF as a data URL
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    return `data:application/pdf;base64,${pdfBase64}`;
    
  } catch (error) {
    console.error("Error generating placeholder PDF:", error);
    throw new Error(`Failed to generate placeholder PDF: ${error}`);
  }
};
