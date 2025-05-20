import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { toast } from 'sonner';
import { captureStageAsDataUrl } from '@/components/accident/scheme/SchemeExport';
import { downloadPDF } from '@/utils/pdfGeneratorUtils';

const usePdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateAndDownloadPdf = async (formData: any, schemeImageDataUrl: string | null = null): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // Si aucune image du schéma n'est fournie, essayer de la capturer
      if (!schemeImageDataUrl) {
        try {
          schemeImageDataUrl = await captureStageAsDataUrl();
        } catch (err) {
          console.error("Erreur lors de la capture du schéma:", err);
        }
      }
      
      // Créer un document PDF vide
      const pdfDoc = await PDFDocument.create();
      
      // Ajouter une police standard
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Créer une nouvelle page
      const page = pdfDoc.addPage([595, 842]); // A4 size in points (595 x 842)
      const { width, height } = page.getSize();
      
      // Ajouter un titre
      const title = "CONSTAT AMIABLE AUTOMOBILE";
      const titleWidth = helveticaBold.widthOfTextAtSize(title, 16);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 50,
        size: 16,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      // Ajouter la date et l'heure
      const dateTimeString = `Date: ${formData.date} - Heure: ${formData.time}`;
      page.drawText(dateTimeString, {
        x: 50,
        y: height - 80,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Ajouter le lieu
      const locationString = `Lieu: ${formData.location}`;
      page.drawText(locationString, {
        x: 50,
        y: height - 100,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Ajouter l'information sur les blessés si applicable
      let injuriesY = height - 120;
      if (formData.hasInjuries) {
        page.drawText("Blessés: Oui", {
          x: 50,
          y: injuriesY,
          size: 10,
          font: helveticaBold,
          color: rgb(0.8, 0, 0),
        });
        
        injuriesY -= 20;
        page.drawText(`Description: ${formData.injuriesDescription || 'Non précisé'}`, {
          x: 70,
          y: injuriesY,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      } else {
        page.drawText("Blessés: Non", {
          x: 50,
          y: injuriesY,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
      
      // Section Véhicule A
      let vehicleAY = injuriesY - 40;
      page.drawText("VÉHICULE A", {
        x: 50,
        y: vehicleAY,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0.8),
      });
      
      vehicleAY -= 20;
      page.drawText(`Immatriculation: ${formData.licensePlate || 'Non renseigné'}`, {
        x: 70,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Marque: ${formData.vehicleBrand || 'Non renseigné'} - Modèle: ${formData.vehicleModel || 'Non renseigné'}`, {
        x: 70,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Année: ${formData.vehicleYear || 'Non renseigné'}`, {
        x: 70,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Assurance: ${formData.insuranceCompany || 'Non renseigné'} - Contrat: ${formData.insurancePolicy || 'Non renseigné'}`, {
        x: 70,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Conducteur A
      vehicleAY -= 25;
      page.drawText("Conducteur:", {
        x: 70,
        y: vehicleAY,
        size: 10,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Nom: ${formData.driver?.name || 'Non renseigné'}`, {
        x: 90,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Adresse: ${formData.driver?.address || 'Non renseigné'}`, {
        x: 90,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Téléphone: ${formData.driver?.phone || 'Non renseigné'}`, {
        x: 90,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleAY -= 15;
      page.drawText(`Permis: ${formData.driver?.licenseNumber || 'Non renseigné'}`, {
        x: 90,
        y: vehicleAY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Section Véhicule B
      let vehicleBY = injuriesY - 40;
      page.drawText("VÉHICULE B", {
        x: 300,
        y: vehicleBY,
        size: 12,
        font: helveticaBold,
        color: rgb(0.8, 0, 0),
      });
      
      vehicleBY -= 20;
      page.drawText(`Immatriculation: ${formData.otherVehicle?.licensePlate || 'Non renseigné'}`, {
        x: 320,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Marque: ${formData.otherVehicle?.brand || 'Non renseigné'} - Modèle: ${formData.otherVehicle?.model || 'Non renseigné'}`, {
        x: 320,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Année: ${formData.otherVehicle?.year || 'Non renseigné'}`, {
        x: 320,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Assurance: ${formData.otherVehicle?.insuranceCompany || 'Non renseigné'} - Contrat: ${formData.otherVehicle?.insurancePolicy || 'Non renseigné'}`, {
        x: 320,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Conducteur B
      vehicleBY -= 25;
      page.drawText("Conducteur:", {
        x: 320,
        y: vehicleBY,
        size: 10,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Nom: ${formData.otherDriver?.name || 'Non renseigné'}`, {
        x: 340,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Adresse: ${formData.otherDriver?.address || 'Non renseigné'}`, {
        x: 340,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Téléphone: ${formData.otherDriver?.phone || 'Non renseigné'}`, {
        x: 340,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      vehicleBY -= 15;
      page.drawText(`Permis: ${formData.otherDriver?.licenseNumber || 'Non renseigné'}`, {
        x: 340,
        y: vehicleBY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      // Ajouter le schéma s'il est disponible
      if (schemeImageDataUrl) {
        try {
          const schemeY = Math.min(vehicleAY, 300) - 40;
          
          // Conversion de Data URL en bytes
          const base64Data = schemeImageDataUrl.split(',')[1];
          const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const image = await pdfDoc.embedPng(imageBytes);
          
          // Calculer la taille de l'image pour qu'elle tienne dans la page mais reste lisible
          const imageDims = image.scale(0.5); // Adjust scale as needed
          
          page.drawText("SCHÉMA DE L'ACCIDENT:", {
            x: 50,
            y: schemeY,
            size: 12,
            font: helveticaBold,
            color: rgb(0, 0, 0),
          });
          
          page.drawImage(image, {
            x: (width - imageDims.width) / 2,
            y: schemeY - imageDims.height - 10,
            width: imageDims.width,
            height: imageDims.height,
          });
        } catch (error) {
          console.error('Error embedding scheme image in PDF:', error);
          // Continue without the image
        }
      }
      
      // Générer le PDF en tant que Uint8Array
      const pdfBytes = await pdfDoc.save();
      
      // Convertir en Blob
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Créer un URL pour le PDF
      const pdfUrl = URL.createObjectURL(blob);
      
      // Télécharger le PDF
      const fileName = `constat-${formData.date || new Date().toISOString().split('T')[0]}.pdf`;
      const downloaded = await downloadPDF(pdfUrl, fileName);
      
      if (!downloaded) {
        throw new Error('Échec du téléchargement du PDF');
      }
      
      return;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to convert data URL to bytes
  const dataUrlToBytes = (dataUrl: string): Uint8Array => {
    const base64 = dataUrl.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  
  return { generateAndDownloadPdf, isGenerating };
};

export default usePdfGenerator;
