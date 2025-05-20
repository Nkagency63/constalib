
/**
 * Main exports for the CERFA module
 */

import { generateCerfaPDF as generateCerfaWithPdfLib } from '../cerfa';

// Export helper functions
export function splitTextIntoLines(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

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
    // Use the pdf-lib generator
    return await generateCerfaWithPdfLib(formData, schemeImageDataUrl, signatures || undefined);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error("Impossible de générer le PDF du constat amiable");
  }
}
