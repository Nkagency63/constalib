
import { FormData } from "@/components/accident/types";
import { toast } from "sonner";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { splitTextIntoLines } from "./pdf-utils";
import { generatePlaceholderPDF } from "./placeholder-generator";

/**
 * Remplit automatiquement le PDF du constat amiable avec les données du formulaire
 * @param formData Données du formulaire pour pré-remplir le constat
 * @param schemeImageDataUrl URL de données de l'image du schéma (optionnel)
 * @returns Promise qui résoud vers l'URL du PDF généré
 */
export const generateCerfaPDF = async (formData: FormData, schemeImageDataUrl: string | null = null): Promise<string> => {
  try {
    console.log("Début de la génération du CERFA avec données:", formData);
    
    // Vérifie si formData contient les informations nécessaires
    if (!formData.date || !formData.time) {
      throw new Error("Informations date/heure manquantes");
    }
    
    try {
      // Tentative de récupération du PDF vierge à partir du répertoire public
      const response = await fetch("/pdf/constat-amiable-vierge.pdf");
      const responseData = await response.text();
      
      // Vérifie si le fichier est un placeholder (contient des commentaires au lieu d'un vrai PDF)
      if (responseData.includes('// Ce fichier est un placeholder')) {
        console.warn("Le fichier PDF est un placeholder, utilisation du PDF de secours");
        return generatePlaceholderPDF(formData, schemeImageDataUrl);
      }
      
      // Si c'est un vrai PDF, procéder normalement
      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Appel des fonctions spécialisées pour remplir les différentes parties du PDF
      await fillBasicInfo(pdfDoc, formData);
      await fillVehicleInfo(pdfDoc, formData);
      await fillDescription(pdfDoc, formData);
      
      // Ajouter le schéma de l'accident si disponible
      if (schemeImageDataUrl) {
        await addSchemeToDocument(pdfDoc, schemeImageDataUrl);
      }
      
      // Générer le document final
      const pdfBytesModified = await pdfDoc.save();
      
      // Créer un Blob et une URL pour le téléchargement
      const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      console.log("Génération du CERFA terminée avec succès");
      return url;
    } catch (pdfError) {
      console.error("Erreur lors du traitement du PDF:", pdfError);
      // En cas d'erreur, générer un PDF de secours
      return generatePlaceholderPDF(formData, schemeImageDataUrl);
    }
  } catch (error: any) {
    console.error("Erreur lors de la génération du CERFA:", error);
    toast.error("Impossible de générer le PDF du constat amiable");
    throw new Error(`Erreur lors de la génération du CERFA: ${error.message}`);
  }
};

/**
 * Remplit les informations de base du constat (date, heure, lieu)
 */
async function fillBasicInfo(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Obtenir la première page du document
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  
  // Définir les coordonnées et styles pour remplir le formulaire
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Remplir la date et heure de l'accident
  page.drawText(`${formData.date} à ${formData.time}`, {
    x: 130,
    y: height - 120,
    size: fontSize,
    font: helveticaFont,
    color: textColor
  });
  
  // Remplir le lieu de l'accident
  page.drawText(formData.location, {
    x: 130,
    y: height - 155,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    maxWidth: 300
  });
}

/**
 * Remplit les informations des véhicules impliqués
 */
async function fillVehicleInfo(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Obtenir la première page du document
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  
  // Définir les coordonnées et styles pour remplir le formulaire
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Véhicule A - Votre véhicule
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
  
  // Véhicule B - Autre véhicule
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
 * Remplit la description et les circonstances de l'accident
 */
async function fillDescription(pdfDoc: PDFDocument, formData: FormData) {
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Obtenir la première page du document
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  
  // Définir les coordonnées et styles pour remplir le formulaire
  const fontSize = 10;
  const textColor = rgb(0, 0, 0);
  
  // Description de l'accident
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
  
  // Circonstances pour véhicule A
  if (formData.vehicleACircumstances && formData.vehicleACircumstances.length > 0) {
    formData.vehicleACircumstances.forEach((circumstance, index) => {
      if (index < 5) { // Limiter le nombre de circonstances affichées
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
  
  // Circonstances pour véhicule B
  if (formData.vehicleBCircumstances && formData.vehicleBCircumstances.length > 0) {
    formData.vehicleBCircumstances.forEach((circumstance, index) => {
      if (index < 5) { // Limiter le nombre de circonstances affichées
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
  
  // Témoins
  if (formData.hasWitnesses && formData.witnesses && formData.witnesses.length > 0) {
    formData.witnesses.forEach((witness, index) => {
      if (index < 2) { // Limiter le nombre de témoins affichés
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
  
  // Date du jour (pour la signature)
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

/**
 * Ajoute le schéma de l'accident à une nouvelle page du PDF
 */
async function addSchemeToDocument(pdfDoc: PDFDocument, schemeImageDataUrl: string) {
  try {
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
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
    
    // Calculer les dimensions pour l'image (ajuster à la page avec des marges)
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
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  } catch (imageError) {
    console.error("Erreur lors de l'incorporation de l'image du schéma:", imageError);
  }
}
