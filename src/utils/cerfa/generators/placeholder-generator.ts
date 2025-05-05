
// Cet import n'est pas visible dans le code utilisateur mais doit être présent
// pour que le generator fonctionne - ne pas supprimer!
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Génère un PDF de constat amiable de remplacement avec toutes les données du formulaire
 * Remplace le template CERFA officiel pour le développement
 */
export const generatePlaceholderPDF = async (
  formData: any, 
  schemeImageDataUrl: string | null = null,
  signatures?: {
    partyA?: string | null;
    partyB?: string | null;
  }
): Promise<string> => {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 en paysage
  
  // Add fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Draw page title
  page.drawText('CONSTAT AMIABLE AUTOMOBILE', {
    x: 300,
    y: 550,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0.7)
  });

  // Draw date and time
  page.drawText(`Date de l'accident: ${formData.date || 'Non renseigné'}`, {
    x: 50, y: 520, size: 12, font: regularFont
  });
  
  page.drawText(`Heure: ${formData.time || 'Non renseigné'}`, {
    x: 350, y: 520, size: 12, font: regularFont
  });

  // Adresse
  page.drawText(`Lieu: ${formData.location || 'Non renseigné'}`, {
    x: 50, y: 500, size: 12, font: regularFont
  });

  // Coordonnées GPS
  if (formData.geolocation && formData.geolocation.lat && formData.geolocation.lng) {
    page.drawText(`Coordonnées GPS: ${formData.geolocation.lat.toFixed(5)}, ${formData.geolocation.lng.toFixed(5)}`, {
      x: 350, y: 500, size: 12, font: regularFont
    });
  }

  // Blessés - Nouvelle section
  page.drawText('BLESSÉS ÉVENTUELS (même légers)', {
    x: 50, y: 480, size: 14, font: boldFont, color: rgb(0.8, 0, 0)
  });

  if (formData.hasInjuries) {
    page.drawText('OUI - ' + (formData.injuriesDescription || 'Description non précisée'), {
      x: 70, y: 460, size: 10, font: regularFont
    });
  } else {
    page.drawText('NON - Pas de blessés', {
      x: 70, y: 460, size: 10, font: regularFont
    });
  }

  // Dégâts matériels autres qu'aux véhicules A et B - Nouvelle section
  page.drawText('DÉGÂTS MATÉRIELS AUTRES QU\'AUX VÉHICULES A ET B', {
    x: 350, y: 480, size: 14, font: boldFont, color: rgb(0.8, 0, 0)
  });

  if (formData.hasMaterialDamage) {
    page.drawText('OUI - ' + (formData.materialDamageDescription || 'Description non précisée'), {
      x: 370, y: 460, size: 10, font: regularFont
    });
  } else {
    page.drawText('NON - Pas de dégâts matériels autres', {
      x: 370, y: 460, size: 10, font: regularFont
    });
  }

  // VEHICULE A
  page.drawText('VÉHICULE A', {
    x: 100, y: 440, size: 16, font: boldFont, color: rgb(0, 0, 0.7)
  });
  
  // Preneur d'assurance / assuré
  page.drawText('PRENEUR D\'ASSURANCE/ASSURÉ', {
    x: 50, y: 420, size: 12, font: boldFont
  });
  
  page.drawText(`Nom: ${formData.insuredName || 'Non renseigné'}`, {
    x: 70, y: 400, size: 10, font: regularFont
  });
  
  page.drawText(`Adresse: ${formData.insuredAddress || 'Non renseigné'}`, {
    x: 70, y: 385, size: 10, font: regularFont
  });
  
  page.drawText(`Téléphone: ${formData.insuredPhone || 'Non renseigné'}`, {
    x: 70, y: 370, size: 10, font: regularFont
  });
  
  page.drawText(`Email: ${formData.personalEmail || 'Non renseigné'}`, {
    x: 70, y: 355, size: 10, font: regularFont
  });

  // Conducteur
  page.drawText('CONDUCTEUR', {
    x: 50, y: 335, size: 12, font: boldFont
  });
  
  page.drawText(`Nom: ${formData.driverName || formData.insuredName || 'Non renseigné'}`, {
    x: 70, y: 315, size: 10, font: regularFont
  });
  
  page.drawText(`Adresse: ${formData.driverAddress || formData.insuredAddress || 'Non renseigné'}`, {
    x: 70, y: 300, size: 10, font: regularFont
  });
  
  page.drawText(`Permis de conduire n°: ${formData.driverLicense || 'Non renseigné'}`, {
    x: 70, y: 285, size: 10, font: regularFont
  });

  // Véhicule A - informations
  page.drawText('VÉHICULE', {
    x: 50, y: 265, size: 12, font: boldFont
  });
  
  page.drawText(`Marque: ${formData.vehicleBrand || 'Non renseigné'}`, {
    x: 70, y: 245, size: 10, font: regularFont
  });
  
  page.drawText(`Modèle: ${formData.vehicleModel || 'Non renseigné'}`, {
    x: 70, y: 230, size: 10, font: regularFont
  });
  
  page.drawText(`N° d'immatriculation: ${formData.licensePlate || 'Non renseigné'}`, {
    x: 70, y: 215, size: 10, font: regularFont
  });

  // VEHICULE B
  page.drawText('VÉHICULE B', {
    x: 500, y: 440, size: 16, font: boldFont, color: rgb(0, 0, 0.7)
  });
  
  // Preneur d'assurance / assuré B
  page.drawText('PRENEUR D\'ASSURANCE/ASSURÉ', {
    x: 450, y: 420, size: 12, font: boldFont
  });
  
  page.drawText(`Nom: ${formData.otherInsuredName || 'Non renseigné'}`, {
    x: 470, y: 400, size: 10, font: regularFont
  });
  
  page.drawText(`Adresse: ${formData.otherInsuredAddress || 'Non renseigné'}`, {
    x: 470, y: 385, size: 10, font: regularFont
  });
  
  page.drawText(`Téléphone: ${formData.otherInsuredPhone || 'Non renseigné'}`, {
    x: 470, y: 370, size: 10, font: regularFont
  });
  
  page.drawText(`Email: ${formData.otherInsuredEmail || 'Non renseigné'}`, {
    x: 470, y: 355, size: 10, font: regularFont
  });

  // Conducteur B
  page.drawText('CONDUCTEUR', {
    x: 450, y: 335, size: 12, font: boldFont
  });
  
  page.drawText(`Nom: ${formData.otherDriverName || 'Non renseigné'}`, {
    x: 470, y: 315, size: 10, font: regularFont
  });
  
  page.drawText(`Adresse: ${formData.otherDriverAddress || 'Non renseigné'}`, {
    x: 470, y: 300, size: 10, font: regularFont
  });
  
  page.drawText(`Permis de conduire n°: ${formData.otherDriverLicense || 'Non renseigné'}`, {
    x: 470, y: 285, size: 10, font: regularFont
  });

  // Véhicule B - informations
  page.drawText('VÉHICULE', {
    x: 450, y: 265, size: 12, font: boldFont
  });
  
  page.drawText(`Marque: ${formData.otherVehicle?.brand || 'Non renseigné'}`, {
    x: 470, y: 245, size: 10, font: regularFont
  });
  
  page.drawText(`Modèle: ${formData.otherVehicle?.model || 'Non renseigné'}`, {
    x: 470, y: 230, size: 10, font: regularFont
  });
  
  page.drawText(`N° d'immatriculation: ${formData.otherVehicle?.licensePlate || 'Non renseigné'}`, {
    x: 470, y: 215, size: 10, font: regularFont
  });

  // Circonstances
  page.drawText('CIRCONSTANCES', {
    x: 300, y: 200, size: 14, font: boldFont
  });
  
  if (formData.vehicleACircumstances && formData.vehicleACircumstances.length > 0) {
    page.drawText('Véhicule A:', {
      x: 50, y: 180, size: 12, font: boldFont
    });
    
    formData.vehicleACircumstances.forEach((circ: string, index: number) => {
      page.drawText(`- ${circ}`, {
        x: 70, y: 165 - (index * 15), size: 10, font: regularFont
      });
    });
  }
  
  if (formData.vehicleBCircumstances && formData.vehicleBCircumstances.length > 0) {
    page.drawText('Véhicule B:', {
      x: 450, y: 180, size: 12, font: boldFont
    });
    
    formData.vehicleBCircumstances.forEach((circ: string, index: number) => {
      page.drawText(`- ${circ}`, {
        x: 470, y: 165 - (index * 15), size: 10, font: regularFont
      });
    });
  }

  // Description
  page.drawText('DESCRIPTION', {
    x: 300, y: 80, size: 14, font: boldFont
  });
  
  // Description text with word wrap (simplified)
  const description = formData.description || 'Aucune description fournie';
  const words = description.split(' ');
  let line = '';
  let y = 60;
  
  for (const word of words) {
    if ((line + word).length > 70) {
      page.drawText(line, {
        x: 50, y, size: 10, font: regularFont
      });
      line = word + ' ';
      y -= 15;
      if (y < 20) break; // Stop if no more room
    } else {
      line += word + ' ';
    }
  }
  
  if (line && y >= 20) {
    page.drawText(line, {
      x: 50, y, size: 10, font: regularFont
    });
  }
  
  // Scheme image - on a new page
  if (schemeImageDataUrl) {
    try {
      // Get the base64 data from the data URL
      const base64Data = schemeImageDataUrl.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid data URL format');
      }
      
      // Embed the image into the PDF
      const schemeImage = await pdfDoc.embedPng(Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)));
      
      // Add a new page for the scheme
      const schemePage = pdfDoc.addPage([842, 595]);
      
      // Draw a title for the scheme page
      schemePage.drawText('SCHÉMA DE L\'ACCIDENT', {
        x: 300, y: 550, size: 18, font: boldFont, color: rgb(0, 0, 0.7)
      });
      
      // Calculate dimensions to fit the image with proper aspect ratio
      const dimensions = schemeImage.scale(0.5);
      const maxWidth = 700;
      const maxHeight = 400;
      
      let width = dimensions.width;
      let height = dimensions.height;
      
      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }
      
      // Center the image on the page
      const x = (842 - width) / 2;
      const y = (595 - height) / 2;
      
      // Draw the scheme image
      schemePage.drawImage(schemeImage, {
        x, y, width, height
      });
      
      // Légende pour les véhicules si les données sont disponibles
      const legendY = y - 40;
      if (formData.vehicleLabels && formData.vehicleLabels.A) {
        schemePage.drawText(`Véhicule A: ${formData.vehicleLabels.A.brand} ${formData.vehicleLabels.A.model} (${formData.vehicleLabels.A.licensePlate})`, {
          x: x, y: legendY, size: 12, font: boldFont
        });
      }
      
      if (formData.vehicleLabels && formData.vehicleLabels.B) {
        schemePage.drawText(`Véhicule B: ${formData.vehicleLabels.B.brand} ${formData.vehicleLabels.B.model} (${formData.vehicleLabels.B.licensePlate})`, {
          x: x, y: legendY - 20, size: 12, font: boldFont
        });
      }
      
      // Date et lieu en bas de page
      schemePage.drawText(`${formData.date || 'Date non précisée'} - ${formData.location || 'Lieu non précisé'}`, {
        x: x, y: 30, size: 10, font: regularFont
      });
      
    } catch (error) {
      console.error("Error embedding scheme image in PDF:", error);
    }
  }

  // Signatures - ajouter les images de signature si disponibles
  if (signatures) {
    const signaturesPage = pdfDoc.addPage([842, 595]);
    
    signaturesPage.drawText('SIGNATURES', {
      x: 350, y: 550, size: 18, font: boldFont, color: rgb(0, 0, 0.7)
    });
    
    // Signature A
    signaturesPage.drawText('SIGNATURE VÉHICULE A', {
      x: 150, y: 500, size: 14, font: boldFont
    });
    
    if (signatures.partyA) {
      try {
        const signatureAImg = await pdfDoc.embedPng(
          Uint8Array.from(atob(signatures.partyA.split(',')[1]), c => c.charCodeAt(0))
        );
        
        const dimensionsA = signatureAImg.scale(0.5);
        signaturesPage.drawImage(signatureAImg, {
          x: 100,
          y: 350,
          width: dimensionsA.width < 200 ? dimensionsA.width : 200,
          height: dimensionsA.height < 100 ? dimensionsA.height : 100
        });
      } catch (error) {
        console.error("Error embedding signature A:", error);
      }
    }
    
    // Signature B
    signaturesPage.drawText('SIGNATURE VÉHICULE B', {
      x: 550, y: 500, size: 14, font: boldFont
    });
    
    if (signatures.partyB) {
      try {
        const signatureBImg = await pdfDoc.embedPng(
          Uint8Array.from(atob(signatures.partyB.split(',')[1]), c => c.charCodeAt(0))
        );
        
        const dimensionsB = signatureBImg.scale(0.5);
        signaturesPage.drawImage(signatureBImg, {
          x: 500,
          y: 350,
          width: dimensionsB.width < 200 ? dimensionsB.width : 200,
          height: dimensionsB.height < 100 ? dimensionsB.height : 100
        });
      } catch (error) {
        console.error("Error embedding signature B:", error);
      }
    }
  }

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};
