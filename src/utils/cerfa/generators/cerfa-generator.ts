
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
    console.log("Starting CERFA generation with data:", formData);
    toast.info("Starting PDF generation...");
    
    // Check if form data contains necessary information
    if (!formData.date || !formData.time) {
      console.error("Missing required information");
      throw new Error("Missing date/time information");
    }
    
    // First try to get the official form from Supabase Storage
    console.log("Attempting to retrieve form from Supabase Storage");
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('pdf-templates')
        .download('constat-amiable-officiel.pdf');
      
      if (!storageError && storageData) {
        console.log("Official form found in Supabase Storage");
        toast.info("Official form template found");
        const pdfBytes = await storageData.arrayBuffer();
        return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
      }
      
      console.warn("Form not found in Supabase Storage:", storageError?.message);
    } catch (storageError) {
      console.error("Error accessing Supabase storage:", storageError);
    }
    
    // If not found in storage, try from public folder
    console.log("Attempting to retrieve form from public folder");
    try {
      const response = await fetch("/pdf/constat-amiable-officiel.pdf");
      
      if (!response.ok) {
        console.warn("Official form not found in public folder, trying standard blank form");
        const fallbackResponse = await fetch("/pdf/constat-amiable-vierge.pdf");
        
        if (!fallbackResponse.ok) {
          console.warn("Standard blank form is not available, generating fallback PDF");
          return generatePlaceholderPDF(formData, schemeImageDataUrl);
        }
        
        console.log("Standard blank form found");
        toast.info("Using standard accident report template");
        const pdfBytes = await fallbackResponse.arrayBuffer();
        return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
      }
      
      console.log("Official form found in public folder");
      toast.info("Using official accident report template");
      const pdfBytes = await response.arrayBuffer();
      return await processFormPDF(pdfBytes, formData, schemeImageDataUrl);
    } catch (fetchError) {
      console.error("Error downloading PDF:", fetchError);
      console.log("Generating fallback PDF due to download error");
      return generatePlaceholderPDF(formData, schemeImageDataUrl);
    }
  } catch (error: any) {
    console.error("Error during CERFA generation:", error);
    toast.error("Unable to generate accident report PDF");
    throw new Error(`Error during CERFA generation: ${error.message}`);
  }
};
