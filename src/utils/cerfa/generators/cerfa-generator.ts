
/**
 * Main file for CERFA PDF generation
 */
import { FormData } from "@/components/accident/types";
import { toast } from "sonner";
import { processFormPDF } from "./base-generator";
import { generatePlaceholderPDF } from "./placeholder-generator";
import { supabase } from "@/integrations/supabase/client";

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
      console.error("Informations obligatoires manquantes");
      throw new Error("Informations date/heure manquantes");
    }
    
    // Essayer d'abord d'obtenir le formulaire officiel de Supabase Storage
    console.log("Tentative de récupération du formulaire de Supabase Storage");
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('pdf-templates')
        .download('constat-amiable-officiel.pdf');
      
      if (!storageError && storageData) {
        console.log("Formulaire officiel trouvé dans Supabase Storage");
        const pdfBytes = await storageData.arrayBuffer();
        return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
      }
      
      console.warn("Formulaire non trouvé dans Supabase Storage:", storageError?.message);
    } catch (storageError) {
      console.error("Erreur lors de l'accès au stockage Supabase:", storageError);
    }
    
    // Si non trouvé dans le stockage, essayer depuis le dossier public
    console.log("Tentative de récupération du formulaire depuis le dossier public");
    try {
      const response = await fetch("/pdf/constat-amiable-officiel.pdf");
      
      if (!response.ok) {
        console.warn("Formulaire officiel non trouvé dans le dossier public, tentative avec le formulaire vierge standard");
        const fallbackResponse = await fetch("/pdf/constat-amiable-vierge.pdf");
        
        if (!fallbackResponse.ok) {
          console.warn("Le formulaire vierge standard n'est pas disponible, génération d'un PDF de secours");
          return generatePlaceholderPDF(formData, schemeImageDataUrl);
        }
        
        console.log("Formulaire vierge standard trouvé");
        const pdfBytes = await fallbackResponse.arrayBuffer();
        return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
      }
      
      console.log("Formulaire officiel trouvé dans le dossier public");
      const pdfBytes = await response.arrayBuffer();
      return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
    } catch (fetchError) {
      console.error("Erreur lors du téléchargement du PDF:", fetchError);
      console.log("Génération d'un PDF de secours suite à l'erreur de téléchargement");
      return generatePlaceholderPDF(formData, schemeImageDataUrl);
    }
  } catch (error: any) {
    console.error("Erreur lors de la génération du CERFA:", error);
    toast.error("Impossible de générer le PDF du constat amiable");
    throw new Error(`Erreur lors de la génération du CERFA: ${error.message}`);
  }
};
