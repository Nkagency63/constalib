
import { FormData } from "@/components/accident/types";
import { generateCerfaPDF as generateFullCerfaPDF } from "./generators/cerfa-generator";
import { generatePlaceholderPDF } from "./generators/placeholder-generator";

/**
 * Generate a CERFA PDF based on form data
 */
export const generateCerfaPDF = async (
  formData: FormData,
  schemeImageDataUrl: string | null = null,
  signatures?: { partyA: string | null; partyB: string | null }
): Promise<string> => {
  try {
    // For now, we'll use the placeholder generator for simplicity
    // In production, this would detect all needed info and use the full generator
    const pdfUrl = await generatePlaceholderPDF(formData, schemeImageDataUrl, signatures);
    return pdfUrl;
  } catch (error) {
    console.error("Error generating CERFA PDF:", error);
    throw new Error(`Failed to generate PDF: ${error}`);
  }
};

// Re-export other PDF utilities as needed
export { generateFullCerfaPDF, generatePlaceholderPDF };
