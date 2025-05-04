
/**
 * Base functionality for PDF generation
 */
import { FormData } from "@/components/accident/types";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";

/**
 * Process a PDF form with the provided form data
 * @param formBytes The PDF form as ArrayBuffer
 * @param formData The form data to fill into the PDF
 * @param schemeImageDataUrl Optional scheme image data URL
 * @param signatures Optional signatures data
 * @param reportId Optional report ID for tracking
 * @returns Promise resolving to the URL of the generated PDF
 */
export const processFormPDF = async (
  formBytes: ArrayBuffer,
  formData: FormData,
  schemeImageDataUrl: string | null = null,
  signatures?: {
    partyA?: string | null;
    partyB?: string | null;
  },
  reportId?: string
): Promise<string> => {
  try {
    // Validate that the bytes are a proper PDF
    if (!isPDF(formBytes)) {
      throw new Error("Invalid PDF file format");
    }
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(formBytes);
    
    // Get form fields for debugging
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log("Available form fields:", fields.map(f => f.getName()));
    
    // TODO: Fill form fields with form data
    // This is a placeholder for the actual form-filling logic
    // The implementation would depend on the specific PDF form structure
    
    // Save the filled form
    const pdfBytes = await pdfDoc.save();
    
    // Convert to blob and create URL
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
    
    return pdfUrl;
  } catch (error) {
    console.error("Error processing PDF form:", error);
    toast.error("Failed to generate PDF");
    throw new Error(`Error processing PDF: ${error}`);
  }
};

/**
 * Check if the provided bytes are likely a PDF file
 * @param bytes ArrayBuffer to check
 * @returns boolean indicating if bytes are a PDF
 */
function isPDF(bytes: ArrayBuffer): boolean {
  // Check for PDF magic number (%PDF-) at the beginning of the file
  const uint8Array = new Uint8Array(bytes);
  if (uint8Array.length < 5) return false;
  
  // Check for %PDF- signature (37 80 68 70 45 in hex)
  return (
    uint8Array[0] === 0x25 && // %
    uint8Array[1] === 0x50 && // P
    uint8Array[2] === 0x44 && // D
    uint8Array[3] === 0x46 && // F
    uint8Array[4] === 0x2D    // -
  );
}
