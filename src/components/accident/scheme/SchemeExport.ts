
/**
 * Utility to export the accident scheme as a data URL or image
 */

// Capture the Konva stage as a data URL
export async function captureStageAsDataUrl(): Promise<string | null> {
  try {
    // Get the Konva stage from the DOM
    const stageContainer = document.querySelector('.konvajs-content canvas');
    
    if (stageContainer instanceof HTMLCanvasElement) {
      return stageContainer.toDataURL('image/png');
    }
    
    // Fallback if the Konva stage is not found
    console.warn('Konva stage not found, trying to find any canvas element');
    const anyCanvas = document.querySelector('canvas');
    
    if (anyCanvas instanceof HTMLCanvasElement) {
      return anyCanvas.toDataURL('image/png');
    }
    
    console.error('No canvas element found to capture scheme');
    return null;
  } catch (error) {
    console.error('Error capturing scheme as data URL:', error);
    return null;
  }
}

// Helper function to convert a data URL to a File object
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}
