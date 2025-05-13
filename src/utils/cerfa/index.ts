
import { FormData } from "@/components/accident/types";
import { generateCerfaWithPdfLib } from "./generators/cerfa-generator";
import { generatePlaceholderPdf } from "./generators/placeholder-generator";

/**
 * Generate a PDF file for a Cerfa form based on form data
 * @param formData Form data from the accident form
 * @param schemeImageDataUrl Optional scheme image as data URL
 * @param signatures Optional signatures for both parties
 * @returns URL to the generated PDF file
 */
export async function generateCerfaPDF(
  formData: FormData, 
  schemeImageDataUrl: string | null = null,
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  }
): Promise<string> {
  try {
    // Use the custom PDF lib generator for the real implementation
    return await generateCerfaWithPdfLib(formData, schemeImageDataUrl, signatures);
  } catch (error) {
    console.error("Error generating CERFA with PDF-lib:", error);
    
    // Fall back to placeholder generator if main one fails
    console.log("Falling back to placeholder generator");
    return await generatePlaceholderPdf(formData);
  }
}
