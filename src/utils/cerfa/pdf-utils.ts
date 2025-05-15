
/**
 * Utility functions for PDF manipulation
 */

/**
 * Splits text into lines with a maximum length
 * @param text Text to split
 * @param maxCharsPerLine Maximum characters per line
 * @returns Array of text lines
 */
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
 * Saves PDF data to a file and returns a URL
 * @param pdfBytes PDF data as ArrayBuffer
 * @param filename Filename to save as
 * @returns Promise resolving to URL of the saved PDF
 */
export async function savePdfToFile(pdfBytes: ArrayBuffer, filename: string): Promise<string> {
  // Create a Blob from the PDF data
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  return url;
}
