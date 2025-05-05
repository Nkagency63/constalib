
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
    partyA?: string | null;
    partyB?: string | null;
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
    
    // If schemeImageDataUrl is null, try to capture it here as a fallback
    if (!schemeImageDataUrl) {
      console.log("Scheme image not provided, attempting fallback capture");
      try {
        const { captureSchemeAsDataUrl } = await import("@/components/accident/scheme/SchemeExport");
        schemeImageDataUrl = await captureSchemeAsDataUrl();
        console.log("Fallback scheme capture:", schemeImageDataUrl ? "successful" : "failed");
      } catch (captureError) {
        console.error("Failed to capture scheme in fallback:", captureError);
      }
    }
    
    // Préparer les informations complètes pour le PDF
    const completeFormData: FormData = {
      ...formData,
      // S'assurer que toutes les données requises sont présentes
      driverInfo: {
        A: {
          name: formData.driverName || formData.insuredName || "Non renseigné",
          address: formData.driverAddress || formData.insuredAddress || "Non renseigné",
          licenseNumber: formData.driverLicense || "Non renseigné",
          phone: formData.driverPhone || formData.insuredPhone || "Non renseigné",
        },
        B: {
          name: formData.otherDriverName || "Non renseigné",
          address: formData.otherDriverAddress || "Non renseigné",
          licenseNumber: formData.otherDriverLicense || "Non renseigné",
          phone: formData.otherDriverPhone || "Non renseigné",
        }
      },
      insuredInfo: {
        A: {
          name: formData.insuredName || "Non renseigné",
          address: formData.insuredAddress || "Non renseigné",
          phone: formData.insuredPhone || "Non renseigné",
          email: formData.personalEmail || "Non renseigné",
        },
        B: {
          name: formData.otherInsuredName || "Non renseigné",
          address: formData.otherInsuredAddress || "Non renseigné",
          phone: formData.otherInsuredPhone || "Non renseigné",
          email: formData.otherInsuredEmail || "Non renseigné",
        }
      },
      // Assurer que les informations relatives aux blessures sont correctement formatées
      injuriesDescription: formData.injuriesDescription || "",
      hasInjuries: formData.hasInjuries || false,
      injuries: formData.injuries || [],
      // Informations sur les dégâts matériels
      hasMaterialDamage: formData.hasMaterialDamage || false,
      materialDamageDescription: formData.materialDamageDescription || ""
    };
    
    // Generate placeholder PDF instead of trying to fetch a template
    // This ensures we can always generate a PDF even if templates aren't available
    toast.info("Generating accident report document...");
    const pdfUrl = await generatePlaceholderPDF(completeFormData, schemeImageDataUrl, signatures);
    
    // Save report reference in database if we have signatures
    if (signatures?.partyA && signatures?.partyB) {
      await saveReportReference(reportId, pdfUrl, signatures);
    }
    
    toast.success("PDF generated successfully");
    return pdfUrl;
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
    partyA?: string | null;
    partyB?: string | null;
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
