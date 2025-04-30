
import { FormData } from "@/components/accident/types";
import { toast } from "sonner";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Remplit automatiquement le PDF du constat amiable avec les données du formulaire
 * @param formData Données du formulaire pour pré-remplir le constat
 * @returns Promise qui résoud vers l'URL du PDF généré
 */
export const generateCerfaPDF = async (formData: FormData): Promise<string> => {
  try {
    console.log("Début de la génération du CERFA avec données:", formData);
    
    // Récupérer le PDF vierge à partir du répertoire public
    const response = await fetch("/pdf/constat-amiable-vierge.pdf");
    const pdfBytes = await response.arrayBuffer();
    
    // Charger le document PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
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
    
    // Générer le document final
    const pdfBytesModified = await pdfDoc.save();
    
    // Créer un Blob et une URL pour le téléchargement
    const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    console.log("Génération du CERFA terminée avec succès");
    return url;
  } catch (error: any) {
    console.error("Erreur lors de la génération du CERFA:", error);
    toast.error("Impossible de générer le PDF du constat amiable");
    throw new Error(`Erreur lors de la génération du CERFA: ${error.message}`);
  }
};
