
/**
 * Capture le contenu du stage Konva en tant que dataURL
 * @returns Promise<string | null> - DataURL de l'image ou null si la capture échoue
 */
export async function captureStageAsDataUrl(): Promise<string | null> {
  try {
    // Rechercher le conteneur du schéma
    const schemeContainer = document.querySelector('.scheme-container');
    if (!schemeContainer) {
      console.error('Conteneur de schéma non trouvé');
      return null;
    }
    
    // Rechercher le canvas Konva
    const canvas = schemeContainer.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas Konva non trouvé');
      return null;
    }
    
    // Récupérer l'image du canvas
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  } catch (error) {
    console.error('Erreur lors de la capture du schéma:', error);
    return null;
  }
}
