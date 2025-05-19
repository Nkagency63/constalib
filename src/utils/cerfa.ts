
import { FormData } from "@/components/accident/types";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Fonction pour générer le PDF du constat amiable
export async function generateCerfaPDF(
  formData: FormData, 
  schemeImageDataUrl: string | null = null,
  signatures: { partyA: string | null; partyB: string | null; } | undefined = undefined
): Promise<string> {
  try {
    // Charger le fichier PDF du constat amiable vierge
    const response = await fetch('/pdf/constat-amiable-vierge.pdf');
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Obtenir les polices pour le document
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Obtenir la première page du document
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    
    // Ajouter les informations de base de l'accident
    if (formData.date) {
      page.drawText(formatDate(formData.date), {
        x: 140,
        y: height - 125,
        size: 10,
        font: helveticaFont,
      });
    }
    
    if (formData.time) {
      page.drawText(formData.time, {
        x: 140,
        y: height - 140,
        size: 10,
        font: helveticaFont,
      });
    }
    
    if (formData.location) {
      page.drawText(formData.location, {
        x: 140,
        y: height - 155,
        size: 9,
        font: helveticaFont,
        maxWidth: 200,
      });
    }
    
    // Ajouter les informations des conducteurs
    const driverA = formData.driverInfo?.A;
    if (driverA) {
      page.drawText(driverA.name || '', {
        x: 70,
        y: height - 250,
        size: 8,
        font: helveticaFont,
      });
      
      page.drawText(driverA.address || '', {
        x: 70,
        y: height - 270,
        size: 8,
        font: helveticaFont,
        maxWidth: 150,
      });
      
      page.drawText(driverA.licenseNumber || '', {
        x: 70,
        y: height - 290,
        size: 8,
        font: helveticaFont,
      });
    }
    
    const driverB = formData.driverInfo?.B;
    if (driverB) {
      page.drawText(driverB.name || '', {
        x: 430,
        y: height - 250,
        size: 8,
        font: helveticaFont,
      });
      
      page.drawText(driverB.address || '', {
        x: 430,
        y: height - 270,
        size: 8,
        font: helveticaFont,
        maxWidth: 150,
      });
      
      page.drawText(driverB.licenseNumber || '', {
        x: 430,
        y: height - 290,
        size: 8,
        font: helveticaFont,
      });
    }
    
    // Ajouter les informations des véhicules
    const vehicleA = formData.vehicleLabels?.A;
    if (vehicleA) {
      page.drawText(`${vehicleA.brand} ${vehicleA.model}`, {
        x: 70,
        y: height - 350,
        size: 8,
        font: helveticaFont,
      });
      
      page.drawText(vehicleA.licensePlate || '', {
        x: 70,
        y: height - 370,
        size: 8,
        font: helveticaFont,
      });
    }
    
    const vehicleB = formData.vehicleLabels?.B;
    if (vehicleB) {
      page.drawText(`${vehicleB.brand} ${vehicleB.model}`, {
        x: 430,
        y: height - 350,
        size: 8,
        font: helveticaFont,
      });
      
      page.drawText(vehicleB.licensePlate || '', {
        x: 430,
        y: height - 370,
        size: 8,
        font: helveticaFont,
      });
    }
    
    // Ajouter les circonstances si disponibles
    if (formData.vehicleACircumstances?.length) {
      formData.vehicleACircumstances.forEach(circId => {
        // Convert to string if it's a Circumstance object
        const circIdStr = typeof circId === 'string' ? circId : circId.id;
        const circIndex = parseInt(circIdStr);
        if (!isNaN(circIndex) && circIndex >= 1 && circIndex <= 17) {
          const y = height - 430 - (circIndex - 1) * 15;
          page.drawText('X', {
            x: 115,
            y,
            size: 10,
            font: helveticaBold,
          });
        }
      });
    }
    
    if (formData.vehicleBCircumstances?.length) {
      formData.vehicleBCircumstances.forEach(circId => {
        // Convert to string if it's a Circumstance object
        const circIdStr = typeof circId === 'string' ? circId : circId.id;
        const circIndex = parseInt(circIdStr);
        if (!isNaN(circIndex) && circIndex >= 1 && circIndex <= 17) {
          const y = height - 430 - (circIndex - 1) * 15;
          page.drawText('X', {
            x: 475,
            y,
            size: 10,
            font: helveticaBold,
          });
        }
      });
    }
    
    // Ajouter le schéma s'il est fourni
    if (schemeImageDataUrl) {
      try {
        // Extraire les données de l'image à partir du dataURL
        const base64Data = schemeImageDataUrl.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Embarquer l'image dans le document
        const image = await pdfDoc.embedPng(imageBytes);
        
        // Calculer les dimensions pour conserver le rapport d'aspect
        const imgWidth = 200;
        const imgHeight = (image.height / image.width) * imgWidth;
        
        // Dessiner l'image sur la page
        page.drawImage(image, {
          x: 200,
          y: height - 600,
          width: imgWidth,
          height: imgHeight,
        });
      } catch (imageError) {
        console.error("Erreur lors de l'ajout du schéma:", imageError);
      }
    }
    
    // Ajouter les signatures si fournies
    if (signatures) {
      if (signatures.partyA) {
        try {
          const signatureA = await pdfDoc.embedPng(
            Uint8Array.from(atob(signatures.partyA.split(',')[1]), c => c.charCodeAt(0))
          );
          page.drawImage(signatureA, {
            x: 70,
            y: height - 680,
            width: 100,
            height: 50,
          });
        } catch (error) {
          console.error("Erreur lors de l'ajout de la signature A:", error);
        }
      }
      
      if (signatures.partyB) {
        try {
          const signatureB = await pdfDoc.embedPng(
            Uint8Array.from(atob(signatures.partyB.split(',')[1]), c => c.charCodeAt(0))
          );
          page.drawImage(signatureB, {
            x: 430,
            y: height - 680,
            width: 100,
            height: 50,
          });
        } catch (error) {
          console.error("Erreur lors de l'ajout de la signature B:", error);
        }
      }
    }
    
    // Sérialiser le PDF
    const pdfBytesModified = await pdfDoc.save();
    
    // Convertir le PDF en URL de données
    const pdfDataUri = `data:application/pdf;base64,${arrayBufferToBase64(pdfBytesModified)}`;
    
    return pdfDataUri;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw new Error("Impossible de générer le PDF du constat amiable");
  }
}

// Fonction pour formater une date au format français
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateStr;
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
