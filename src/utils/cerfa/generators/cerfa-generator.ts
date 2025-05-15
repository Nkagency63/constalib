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
    
    // Add the accident scheme image if provided
    if (schemeImageDataUrl) {
      try {
        // Extract the base64 data
        const base64Data = schemeImageDataUrl.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Get the first page
        const pages = pdfDoc.getPages();
        const page = pages[0];
        
        // Embed the PNG image
        const image = await pdfDoc.embedPng(imageBytes);
        const { width, height } = page.getSize();
        
        // Calculate dimensions for the image (keep aspect ratio but fit in schema box)
        const maxWidth = 180;
        const maxHeight = 180;
        const imgWidth = Math.min(maxWidth, image.width);
        const imgHeight = (image.height / image.width) * imgWidth;
        
        // Position the image in the schema section (adjust coordinates as needed)
        page.drawImage(image, {
          x: 210,
          y: height - 610,
          width: imgWidth,
          height: imgHeight,
        });
        
        console.log("Accident scheme added to PDF successfully");
      } catch (error) {
        console.error("Error adding scheme to PDF:", error);
      }
    }
    
    // Fill in other PDF fields (to be implemented)
    
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
