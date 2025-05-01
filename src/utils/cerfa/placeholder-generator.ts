
import { FormData } from "@/components/accident/types";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { splitTextIntoLines } from "./pdf-utils";

/**
 * Génère un PDF de secours avec les données du formulaire lorsque le PDF vierge n'est pas disponible
 * @param formData Données du formulaire
 * @param schemeImageDataUrl URL de données de l'image du schéma (optionnel)
 * @returns Promise qui résoud vers l'URL du PDF généré
 */
export async function generatePlaceholderPDF(formData: FormData, schemeImageDataUrl: string | null = null): Promise<string> {
  // Créer un nouveau document PDF vierge
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  
  // Ajouter un titre
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
  
  // Informations sur l'accident
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
  
  // Informations sur les véhicules
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
  
  // Circonstances
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
    const yStart = height - 550 - (formData.vehicleACircumstances.length * 20) - 40;
    
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
    const yStart = height - 550 - (formData.vehicleACircumstances.length * 20) - 
                  (formData.vehicleBCircumstances.length * 20) - 80;
    
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

  // Ajout du schéma sur une nouvelle page si disponible
  if (schemeImageDataUrl) {
    try {
      // Convertir l'image dataURL en Uint8Array
      const base64Data = schemeImageDataUrl.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Créer une nouvelle page pour le schéma
      const schemePage = pdfDoc.addPage();
      const { width: schemeWidth, height: schemeHeight } = schemePage.getSize();
      
      // Titre pour la page du schéma
      schemePage.drawText("SCHÉMA DE L'ACCIDENT", {
        x: 50,
        y: schemeHeight - 50,
        size: 16,
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });
      
      // Incorporer l'image dans le PDF
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Calculer les dimensions pour l'image
      const margin = 50;
      const maxImageWidth = schemeWidth - (margin * 2);
      const maxImageHeight = schemeHeight - 100 - margin; // 100 pour le titre et l'espace
      
      const imageRatio = image.width / image.height;
      let imageWidth = maxImageWidth;
      let imageHeight = imageWidth / imageRatio;
      
      // Si l'image est trop haute, ajuster en conséquence
      if (imageHeight > maxImageHeight) {
        imageHeight = maxImageHeight;
        imageWidth = imageHeight * imageRatio;
      }
      
      // Dessiner l'image sur la page
      schemePage.drawImage(image, {
        x: margin + (maxImageWidth - imageWidth) / 2, // Centrer horizontalement
        y: schemeHeight - 100 - imageHeight, // Positionner sous le titre
        width: imageWidth,
        height: imageHeight
      });
      
      // Légende
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
  
  // Pied de page
  page.drawText("Ce document est un résumé généré automatiquement et ne remplace pas le constat amiable officiel.", {
    x: 50,
    y: 50,
    size: 8,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Générer le PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  console.log("PDF de secours généré avec succès");
  return url;
}
