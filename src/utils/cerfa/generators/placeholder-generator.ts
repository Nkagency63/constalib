
import { FormData } from "@/components/accident/types";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { splitTextIntoLines } from "../pdf-utils";

const loadPDF = async (): Promise<PDFDocument> => {
  try {
    const response = await fetch("/pdf/constat-amiable-vierge.pdf");
    const pdfBytes = await response.arrayBuffer();
    return await PDFDocument.load(pdfBytes);
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw new Error("Failed to load the blank PDF form");
  }
};

// Helper function to add text to specific coordinates in the PDF
const addTextToPdf = (
  page,
  text,
  x,
  y,
  { 
    size = 12, 
    color = { r: 0, g: 0, b: 0 },
    font = null
  } = {}
) => {
  if (!text) return;

  page.drawText(text, {
    x,
    y,
    size,
    color: rgb(color.r, color.g, color.b),
    font
  });
};

export const generatePlaceholderPdf = async (formData: FormData): Promise<string> => {
  const pdfDoc = await loadPDF();
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Date and time
  const dateText = formData.date || "XX/XX/XXXX";
  const timeText = formData.time || "XX:XX";
  
  // Add the date in the format DD/MM/YYYY to the top of the form
  addTextToPdf(firstPage, dateText, 300, 720, { 
    size: 12, 
    color: { r: 0, g: 0, b: 0 },
    font: helveticaFont 
  });
  
  addTextToPdf(firstPage, timeText, 380, 720, { 
    size: 12, 
    color: { r: 0, g: 0, b: 0 },
    font: helveticaFont 
  });
  
  // Location
  const locationText = formData.location || "Non spécifié";
  addTextToPdf(firstPage, locationText, 150, 697, {
    size: 10,
    color: { r: 0, g: 0, b: 0 },
    font: helveticaFont
  });
  
  // Basic information about Vehicle A
  if (formData.vehicleLabels?.A) {
    const vehicleA = formData.vehicleLabels.A;
    addTextToPdf(firstPage, vehicleA.licensePlate, 120, 650, {
      size: 10,
      color: { r: 0, g: 0, b: 0 },
      font: helveticaBoldFont
    });
    
    addTextToPdf(firstPage, `${vehicleA.brand} ${vehicleA.model}`, 120, 630, {
      size: 10,
      color: { r: 0, g: 0, b: 0 },
      font: helveticaFont
    });
  }
  
  // Basic information about Vehicle B
  if (formData.vehicleLabels?.B) {
    const vehicleB = formData.vehicleLabels.B;
    addTextToPdf(firstPage, vehicleB.licensePlate, 460, 650, {
      size: 10,
      color: { r: 0, g: 0, b: 0 },
      font: helveticaBoldFont
    });
    
    addTextToPdf(firstPage, `${vehicleB.brand} ${vehicleB.model}`, 460, 630, {
      size: 10,
      color: { r: 0, g: 0, b: 0 },
      font: helveticaFont
    });
  }

  // Add circumstance checkmarks
  if (formData.vehicleACircumstances) {
    formData.vehicleACircumstances.forEach(circ => {
      // This would place an X or a checkmark at specific coordinates
      // The actual coordinates would depend on the PDF layout
      addTextToPdf(firstPage, "X", 120, 400 - (Number(circ.id) * 15), {
        size: 12,
        color: { r: 0, g: 0, b: 1 },
        font: helveticaBoldFont
      });
    });
  }

  if (formData.vehicleBCircumstances) {
    formData.vehicleBCircumstances.forEach(circ => {
      addTextToPdf(firstPage, "X", 460, 400 - (Number(circ.id) * 15), {
        size: 12,
        color: { r: 1, g: 0, b: 0 },
        font: helveticaBoldFont
      });
    });
  }

  // Convert the PDF to bytes and then to base64
  const pdfBytes = await pdfDoc.save();
  const base64String = Buffer.from(pdfBytes).toString('base64');
  return `data:application/pdf;base64,${base64String}`;
};
