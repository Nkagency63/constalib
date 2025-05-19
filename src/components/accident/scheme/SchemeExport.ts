
import { Stage } from 'konva/lib/Stage';
import html2canvas from 'html2canvas';

/**
 * Capture the Konva stage as an image data URL
 * @param stageRef Reference to the Konva stage
 * @returns Promise resolving to a base64 image data URL
 */
export const captureStageAsDataUrl = (stageRef: React.RefObject<Stage>): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!stageRef.current) {
      reject(new Error("No stage reference available"));
      return;
    }
    
    try {
      // Use Konva's toDataURL method to capture the stage
      const dataUrl = stageRef.current.toDataURL({ 
        pixelRatio: 2, // Higher quality
        mimeType: 'image/png' 
      });
      
      resolve(dataUrl);
    } catch (error) {
      console.error("Error capturing stage as data URL:", error);
      reject(error);
    }
  });
};

/**
 * Capture the scheme container element as an image data URL
 * @returns Promise resolving to a base64 image data URL
 */
export const captureSchemeAsDataUrl = async (): Promise<string | null> => {
  try {
    // Try to find the scheme container in the DOM
    const schemeContainer = document.querySelector('.scheme-container') as HTMLElement;
    
    if (!schemeContainer) {
      console.warn("No scheme container found to capture");
      
      // Try to find any Konva container
      const konvaContainer = document.querySelector('.konvajs-content') as HTMLElement;
      
      if (!konvaContainer) {
        console.warn("No Konva container found to capture");
        return null;
      }
      
      // Use html2canvas to capture the Konva container
      const canvas = await html2canvas(konvaContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true
      });
      
      return canvas.toDataURL('image/png');
    }
    
    // Use html2canvas to capture the container
    const canvas = await html2canvas(schemeContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error("Error capturing scheme as data URL:", error);
    return null;
  }
};
