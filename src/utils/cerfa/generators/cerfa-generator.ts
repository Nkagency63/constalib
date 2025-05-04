
/**
 * Main file for CERFA PDF generation
 */
import { FormData } from "@/components/accident/types";
import { toast } from "sonner";
import { processFormPDF } from "./base-generator";
import { generatePlaceholderPDF } from "./placeholder-generator";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a CERFA PDF filled with form data
 * @param formData Form data to fill into the PDF
 * @param schemeImageDataUrl Optional scheme image data URL
 * @param signatures Optional signatures data
 * @returns Promise resolving to the URL of the generated PDF
 */
export const generateCerfaPDF = async (
  formData: FormData, 
  schemeImageDataUrl: string | null = null,
  signatures?: {
    partyA?: string;
    partyB?: string;
  }
): Promise<string> => {
  try {
    console.log("Starting CERFA generation with data:", formData);
    toast.info("Starting PDF generation...");
    
    // Check if form data contains necessary information
    if (!formData.date || !formData.time) {
      console.error("Missing required information");
      throw new Error("Missing date/time information");
    }
    
    // Generate unique reference ID for this report
    const reportId = uuidv4();
    console.log("Generated unique report ID:", reportId);
    
    // First try to get the official form from Supabase Storage
    console.log("Attempting to retrieve form from Supabase Storage");
    try {
      // First try the new bucket name you provided
      const { data: constatData, error: constatError } = await supabase.storage
        .from('constat-amiable-officiel.pdf')
        .download('constat-amiable-officiel.pdf');
      
      if (!constatError && constatData) {
        console.log("Official form found in constat-amiable-officiel.pdf bucket");
        toast.info("Official form template found");
        const pdfBytes = await constatData.arrayBuffer();
        const pdfUrl = await processFormPDF(pdfBytes, formData, schemeImageDataUrl, signatures, reportId);
        
        // Save report reference in database if we have signatures
        if (signatures) {
          await saveReportReference(reportId, pdfUrl, signatures);
        }
        
        return pdfUrl;
      }
      
      // Try from pdf-templates bucket if the first attempt fails
      const { data: storageData, error: storageError } = await supabase.storage
        .from('pdf-templates')
        .download('constat-amiable-officiel.pdf');
      
      if (!storageError && storageData) {
        console.log("Official form found in pdf-templates bucket");
        toast.info("Official form template found");
        const pdfBytes = await storageData.arrayBuffer();
        const pdfUrl = await processFormPDF(pdfBytes, formData, schemeImageDataUrl, signatures, reportId);
        
        // Save report reference in database if we have signatures
        if (signatures) {
          await saveReportReference(reportId, pdfUrl, signatures);
        }
        
        return pdfUrl;
      }
      
      console.warn("Form not found in Supabase Storage:", storageError?.message || constatError?.message);
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
          const pdfUrl = await generatePlaceholderPDF(formData, schemeImageDataUrl, signatures, reportId);
          
          // Save report reference in database if we have signatures
          if (signatures) {
            await saveReportReference(reportId, pdfUrl, signatures);
          }
          
          return pdfUrl;
        }
        
        console.log("Standard blank form found");
        toast.info("Using standard accident report template");
        const pdfBytes = await fallbackResponse.arrayBuffer();
        const pdfUrl = await processFormPDF(pdfBytes, formData, schemeImageDataUrl, signatures, reportId);
        
        // Save report reference in database if we have signatures
        if (signatures) {
          await saveReportReference(reportId, pdfUrl, signatures);
        }
        
        return pdfUrl;
      }
      
      console.log("Official form found in public folder");
      toast.info("Using official accident report template");
      const pdfBytes = await response.arrayBuffer();
      const pdfUrl = await processFormPDF(pdfBytes, formData, schemeImageDataUrl, signatures, reportId);
      
      // Save report reference in database if we have signatures
      if (signatures) {
        await saveReportReference(reportId, pdfUrl, signatures);
      }
      
      return pdfUrl;
    } catch (fetchError) {
      console.error("Error downloading PDF:", fetchError);
      console.log("Generating fallback PDF due to download error");
      const pdfUrl = await generatePlaceholderPDF(formData, schemeImageDataUrl, signatures, reportId);
      
      // Save report reference in database if we have signatures
      if (signatures) {
        await saveReportReference(reportId, pdfUrl, signatures);
      }
      
      return pdfUrl;
    }
  } catch (error: any) {
    console.error("Error during CERFA generation:", error);
    toast.error("Unable to generate accident report PDF");
    throw new Error(`Error during CERFA generation: ${error.message}`);
  }
};

/**
 * Saves report reference to the database
 * @param reportId Unique report ID
 * @param pdfUrl URL of the generated PDF
 * @param signatures Signatures data
 */
const saveReportReference = async (
  reportId: string, 
  pdfUrl: string,
  signatures: {
    partyA?: string;
    partyB?: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('accident_report_signatures')
      .insert({
        report_id: reportId,
        pdf_url: pdfUrl,
        pdf_generated: true,
        party_a_signature: signatures.partyA || null,
        party_b_signature: signatures.partyB || null,
        party_a_signed_at: signatures.partyA ? new Date().toISOString() : null,
        party_b_signed_at: signatures.partyB ? new Date().toISOString() : null
      });
      
    if (error) {
      console.error("Error saving report reference:", error);
    } else {
      console.log("Report reference saved successfully with ID:", reportId);
    }
  } catch (error) {
    console.error("Exception saving report reference:", error);
  }
};
