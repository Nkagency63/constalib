
/**
 * Main file for CERFA PDF generation
 */
import { FormData } from "@/components/accident/types";
import { toast } from "sonner";
import { processFormPDF } from "./base-generator";
import { generatePlaceholderPDF } from "./placeholder-generator";

/**
 * Generates a CERFA PDF filled with form data
 * @param formData Form data to fill into the PDF
 * @param schemeImageDataUrl Optional scheme image data URL
 * @returns Promise resolving to the URL of the generated PDF
 */
export const generateCerfaPDF = async (formData: FormData, schemeImageDataUrl: string | null = null): Promise<string> => {
  try {
    console.log("Début de la génération du CERFA avec données:", formData);
    
    // Check if form data contains necessary information
    if (!formData.date || !formData.time) {
      throw new Error("Informations date/heure manquantes");
    }
    
    try {
      // Try to get the official CERFA form
      const response = await fetch("/pdf/constat-amiable-officiel.pdf");
      
      if (!response.ok) {
        console.warn("Formulaire officiel non trouvé, tentative avec le formulaire vierge standard");
        const fallbackResponse = await fetch("/pdf/constat-amiable-vierge.pdf");
        const responseData = await fallbackResponse.text();
        
        // Check if the file is a placeholder
        if (responseData.includes('// Ce fichier est un placeholder')) {
          console.warn("Le fichier PDF est un placeholder, utilisation du PDF de secours");
          return generatePlaceholderPDF(formData, schemeImageDataUrl);
        }
        
        const pdfBytes = await fallbackResponse.arrayBuffer();
        return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
      }
      
      const pdfBytes = await response.arrayBuffer();
      return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
      
    } catch (pdfError) {
      console.error("Erreur lors du traitement du PDF:", pdfError);
      // If error, generate fallback PDF
      return generatePlaceholderPDF(formData, schemeImageDataUrl);
    }
  } catch (error: any) {
    console.error("Erreur lors de la génération du CERFA:", error);
    toast.error("Impossible de générer le PDF du constat amiable");
    throw new Error(`Erreur lors de la génération du CERFA: ${error.message}`);
  }
};
