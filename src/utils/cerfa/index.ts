
/**
 * Main exports for the CERFA module
 */

import { generateCerfaWithPdfLib } from './generators/cerfa-generator';
import { generatePlaceholderPdf } from './generators/placeholder-generator';

// Export helper functions
export { splitTextIntoLines } from './pdf-utils';

/**
 * Generate a PDF CERFA document from the provided form data
 * @param formData Form data to populate the CERFA document
 * @param schemeImageDataUrl Optional base64 image data URL for the scheme
 * @param signatures Optional signatures data
 * @returns Promise resolving to a URL for the generated PDF
 */
export async function generateCerfaPDF(
  formData: any,
  schemeImageDataUrl: string | null = null,
  signatures: { partyA: string | null; partyB: string | null } | null = null
): Promise<string> {
  try {
    // Try to generate with PDF-Lib first (more complete solution)
    return await generateCerfaWithPdfLib(formData, schemeImageDataUrl, signatures || undefined);
  } catch (error) {
    console.error("Failed to generate PDF with pdf-lib:", error);
    // Fall back to placeholder if the main generator fails
    return await generatePlaceholderPdf(formData);
  }
}
