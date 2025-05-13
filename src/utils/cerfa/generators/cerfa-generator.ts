
import { FormData } from "@/components/accident/types";
import { PDFDocument } from 'pdf-lib';
import { savePdfToFile } from "../pdf-utils";
import { generatePlaceholderPdf } from "./placeholder-generator";

/**
 * Generate a CERFA PDF using the pdf-lib library
 */
export async function generateCerfaWithPdfLib(
  formData: FormData,
  schemeImageDataUrl: string | null = null, 
  signatures?: {
    partyA: string | null;
    partyB: string | null;
  }
): Promise<string> {
  try {
    const response = await fetch('/pdf/constat-amiable-vierge.pdf');
    if (!response.ok) {
      throw new Error(`Failed to load PDF template: ${response.statusText}`);
    }
    
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get form
    const form = pdfDoc.getForm();
    
    // TODO: Fill PDF form fields
    
    // Finalize the PDF
    const modifiedPdfBytes = await pdfDoc.save();
    
    // Save to file and return URL
    return await savePdfToFile(modifiedPdfBytes, 'constat-amiable.pdf');
  } catch (error) {
    console.error("Error generating PDF with pdf-lib:", error);
    // If this fails, fall back to the placeholder version
    return await generatePlaceholderPdf(formData);
  }
}
