/**
 * This file generates a placeholder PDF for CERFA forms
 */
import { PDFDocument, StandardFonts, rgb, PDFForm } from 'pdf-lib';
import { FormData } from '@/components/accident/types';
import { toast } from 'sonner';
import { downloadPDF } from '@/utils/downloadUtils';

// Liste complète des circonstances pour le constat
const circumstanceLabels = {
  'stationary': 'En stationnement',
  'parking': 'Quittait un stationnement',
  'entering_parking': 'Prenait un stationnement',
  'exit_parking': 'Sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre',
  'enter_parking': 'S\'engageait dans un parking, un lieu privé, un chemin de terre',
  'roundabout': 'S\'engageait sur une place à sens giratoire',
  'circular_traffic': 'Roulait sur une place à sens giratoire',
  'rear_collision': 'Heurtait à l\'arrière en roulant dans le même sens et sur une même file',
  'same_direction_diff_lane': 'Roulait dans le même sens et sur une file différente',
  'changing_lanes': 'Changeait de file',
  'overtaking': 'Dépassait',
  'turning_right': 'Tournait à droite',
  'turning_left': 'Tournait à gauche',
  'reversing': 'Reculait',
  'encroaching': 'Empiétait sur une voie réservée à la circulation en sens inverse',
  'from_right': 'Venait de droite',
  'ignored_yield': 'N\'avait pas observé un signal de priorité ou un feu rouge',
  // Ajoutez d'autres circonstances selon vos besoins
};

export const generatePlaceholderPDF = async (
  formData: FormData, 
  schemeImageDataUrl: string | null = null,
  signatures?: {
    partyA?: string | null;
    partyB?: string | null;
  }
): Promise<string> => {
  try {
    console.log("Generating placeholder PDF with formData:", formData);
    
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Add a page
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    
    // Get a standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set default font size
    const fontSize = 10;
    
    // Draw header
    page.drawText('CONSTAT AMIABLE AUTOMOBILE', {
      x: 50,
      y: 560,
      size: 16,
      font: boldFont,
    });
    
    page.drawText('Date de l\'accident: ' + formData.date, {
      x: 50,
      y: 530,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Heure: ' + formData.time, {
      x: 300,
      y: 530,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Lieu: ' + formData.location, {
      x: 50,
      y: 510,
      size: fontSize,
      font: font,
    });
    
    // Draw main sections
    // Véhicule A (left side)
    page.drawText('VÉHICULE A', {
      x: 100,
      y: 480,
      size: 12,
      font: boldFont,
    });
    
    // Vehicle information
    page.drawText('Marque: ' + formData.vehicleBrand, {
      x: 50,
      y: 460,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Modèle: ' + formData.vehicleModel, {
      x: 50,
      y: 445,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Immatriculation: ' + formData.licensePlate, {
      x: 50,
      y: 430,
      size: fontSize,
      font: font,
    });
    
    // Driver information
    page.drawText('CONDUCTEUR', {
      x: 50,
      y: 410,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Nom: ' + (formData.driverName || 'Non renseigné'), {
      x: 50,
      y: 395,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Adresse: ' + (formData.driverAddress || 'Non renseigné'), {
      x: 50,
      y: 380,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Permis: ' + (formData.driverLicense || 'Non renseigné'), {
      x: 50,
      y: 365,
      size: fontSize,
      font: font,
    });
    
    // Ajout de la date d'obtention du permis
    if (formData.driverLicenseDate) {
      page.drawText('Date d\'obtention: ' + formData.driverLicenseDate, {
        x: 50,
        y: 350,
        size: fontSize,
        font: font,
      });
    }
    
    // Insured information
    page.drawText('ASSURÉ', {
      x: 50,
      y: 335,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Nom: ' + (formData.insuredName || 'Non renseigné'), {
      x: 50,
      y: 320,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Adresse: ' + (formData.insuredAddress || 'Non renseigné'), {
      x: 50,
      y: 305,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Compagnie d\'assurance: ' + (formData.insuranceCompany || 'Non renseigné'), {
      x: 50,
      y: 290,
      size: fontSize,
      font: font,
    });
    
    page.drawText('N° de police: ' + (formData.insurancePolicy || 'Non renseigné'), {
      x: 50,
      y: 275,
      size: fontSize,
      font: font,
    });
    
    // Véhicule B (right side)
    page.drawText('VÉHICULE B', {
      x: 550,
      y: 480,
      size: 12,
      font: boldFont,
    });
    
    // Vehicle information
    page.drawText('Marque: ' + (formData.otherVehicle.brand || 'Non renseigné'), {
      x: 500,
      y: 460,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Modèle: ' + (formData.otherVehicle.model || 'Non renseigné'), {
      x: 500,
      y: 445,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Immatriculation: ' + (formData.otherVehicle.licensePlate || 'Non renseigné'), {
      x: 500,
      y: 430,
      size: fontSize,
      font: font,
    });
    
    // Driver information
    page.drawText('CONDUCTEUR', {
      x: 500,
      y: 410,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Nom: ' + (formData.otherDriverName || 'Non renseigné'), {
      x: 500,
      y: 395,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Adresse: ' + (formData.otherDriverAddress || 'Non renseigné'), {
      x: 500,
      y: 380,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Permis: ' + (formData.otherDriverLicense || 'Non renseigné'), {
      x: 500,
      y: 365,
      size: fontSize,
      font: font,
    });
    
    // Ajout de la date d'obtention du permis
    if (formData.otherDriverLicenseDate) {
      page.drawText('Date d\'obtention: ' + formData.otherDriverLicenseDate, {
        x: 500,
        y: 350,
        size: fontSize,
        font: font,
      });
    }
    
    // Insured information
    page.drawText('ASSURÉ', {
      x: 500,
      y: 335,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Nom: ' + (formData.otherInsuredName || 'Non renseigné'), {
      x: 500,
      y: 320,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Adresse: ' + (formData.otherInsuredAddress || 'Non renseigné'), {
      x: 500,
      y: 305,
      size: fontSize,
      font: font,
    });
    
    page.drawText('Compagnie d\'assurance: ' + (formData.otherVehicle.insuranceCompany || 'Non renseigné'), {
      x: 500,
      y: 290,
      size: fontSize,
      font: font,
    });
    
    page.drawText('N° de police: ' + (formData.otherVehicle.insurancePolicy || 'Non renseigné'), {
      x: 500,
      y: 275,
      size: fontSize,
      font: font,
    });
    
    // Circonstances
    page.drawText('CIRCONSTANCES', {
      x: 321,
      y: 480,
      size: 12,
      font: boldFont,
    });
    
    // Liste des circonstances pour le véhicule A
    page.drawText('Véhicule A:', {
      x: 280,
      y: 460,
      size: fontSize,
      font: boldFont,
    });
    
    let yPositionA = 445;
    formData.vehicleACircumstances.forEach((circId) => {
      const circumstanceLabel = circumstanceLabels[circId as keyof typeof circumstanceLabels] || circId;
      page.drawText('✓ ' + circumstanceLabel, {
        x: 280,
        y: yPositionA,
        size: fontSize,
        font: font,
      });
      yPositionA -= 15;
    });
    
    // Liste des circonstances pour le véhicule B
    page.drawText('Véhicule B:', {
      x: 280,
      y: yPositionA - 15,
      size: fontSize,
      font: boldFont,
    });
    
    let yPositionB = yPositionA - 30;
    formData.vehicleBCircumstances.forEach((circId) => {
      const circumstanceLabel = circumstanceLabels[circId as keyof typeof circumstanceLabels] || circId;
      page.drawText('✓ ' + circumstanceLabel, {
        x: 280,
        y: yPositionB,
        size: fontSize,
        font: font,
      });
      yPositionB -= 15;
    });
    
    // Description
    const descriptionY = Math.min(yPositionA, yPositionB) - 30;
    page.drawText('OBSERVATIONS', {
      x: 50,
      y: descriptionY,
      size: 12,
      font: boldFont,
    });
    
    // Split description text into lines if it's longer
    const descriptionText = formData.description || 'Aucune observation';
    const descriptionLines = [];
    let currentLine = '';
    const words = descriptionText.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + word + ' ';
      if (font.widthOfTextAtSize(testLine, fontSize) < 700) {
        currentLine = testLine;
      } else {
        descriptionLines.push(currentLine);
        currentLine = word + ' ';
      }
    }
    if (currentLine) {
      descriptionLines.push(currentLine);
    }
    
    let descLine = descriptionY - 20;
    for (let i = 0; i < descriptionLines.length; i++) {
      page.drawText(descriptionLines[i], {
        x: 50,
        y: descLine,
        size: fontSize,
        font: font,
      });
      descLine -= 15;
    }
    
    // Add scheme if available
    if (schemeImageDataUrl) {
      try {
        console.log("Adding scheme image to PDF");
        // Remove data URL prefix
        const base64Data = schemeImageDataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        
        // Embed the image
        let schemeImage;
        if (schemeImageDataUrl.includes('image/png')) {
          schemeImage = await pdfDoc.embedPng(base64Data);
        } else {
          schemeImage = await pdfDoc.embedJpg(base64Data);
        }
        
        // Calculate size to fit
        const maxWidth = 300;
        const maxHeight = 200;
        const { width, height } = schemeImage.scale(1);
        let scaleFactor = 1;
        
        if (width > maxWidth || height > maxHeight) {
          scaleFactor = Math.min(maxWidth / width, maxHeight / height);
        }
        
        const scaledWidth = width * scaleFactor;
        const scaledHeight = height * scaleFactor;
        
        // Set position (centered)
        const schemeX = 421 - scaledWidth / 2; // Center of page horizontally
        let schemeY = descLine - 30 - scaledHeight; // Below description
        if (schemeY < 110) schemeY = 110; // Minimum position
        
        // Draw scheme
        page.drawImage(schemeImage, {
          x: schemeX,
          y: schemeY,
          width: scaledWidth,
          height: scaledHeight,
        });
        
        // Add caption
        page.drawText('SCHÉMA DE L\'ACCIDENT', {
          x: schemeX + (scaledWidth / 2) - 60,
          y: schemeY - 15,
          size: fontSize,
          font: boldFont,
        });
        
        console.log("Scheme added successfully");
      } catch (schemeError) {
        console.error("Error embedding scheme image:", schemeError);
      }
    }
    
    // Add signatures if available
    if (signatures?.partyA || signatures?.partyB) {
      page.drawText('SIGNATURES', {
        x: 371,
        y: 85,
        size: 12,
        font: boldFont,
      });
      
      page.drawText('Véhicule A', {
        x: 150,
        y: 70,
        size: fontSize,
        font: boldFont,
      });
      
      page.drawText('Véhicule B', {
        x: 600,
        y: 70,
        size: fontSize,
        font: boldFont,
      });
      
      // Add signature images
      try {
        if (signatures.partyA) {
          const base64SignA = signatures.partyA.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
          const signatureA = await pdfDoc.embedPng(base64SignA);
          page.drawImage(signatureA, {
            x: 100,
            y: 20,
            width: 100,
            height: 50,
          });
        }
        
        if (signatures.partyB) {
          const base64SignB = signatures.partyB.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
          const signatureB = await pdfDoc.embedPng(base64SignB);
          page.drawImage(signatureB, {
            x: 550,
            y: 20,
            width: 100,
            height: 50,
          });
        }
      } catch (signError) {
        console.error("Error embedding signatures:", signError);
      }
    }
    
    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert to a blob URL
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return url;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    toast.error('Erreur lors de la génération du PDF');
    throw error;
  }
};
