
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

// Fonction pour exporter l'image de la carte
export const handleExportImage = async ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  if (!mapRef.current) {
    console.error("Map reference not available for export");
    return;
  }

  try {
    const dataUrl = await captureSchemeAsDataUrl();
    if (dataUrl) {
      // Convertir la base64 en blob pour le téléchargement
      const blob = dataURItoBlob(dataUrl);
      saveAs(blob, `accident-schema-${new Date().toISOString().slice(0, 10)}.png`);
    }
  } catch (error) {
    console.error("Error exporting image:", error);
  }
};

// Fonction pour capturer le schéma comme URL de données
export const captureSchemeAsDataUrl = async (): Promise<string | null> => {
  try {
    // Récupérer l'élément de la carte
    const mapElement = document.querySelector('.leaflet-container');
    if (!mapElement) {
      console.error("Map element not found in DOM");
      return null;
    }

    // Utiliser html2canvas pour capturer l'élément en image
    const canvas = await html2canvas(mapElement as HTMLElement, {
      useCORS: true, // Permettre CORS pour les tuiles de carte
      allowTaint: true, // Permettre les éléments potentiellement contaminés
      scale: 2, // Échelle x2 pour une meilleure qualité
      logging: false, // Désactiver les logs pour la production
    });

    // Retourner l'URL de données de l'image
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error("Error capturing scheme:", error);
    return null;
  }
};

// Fonction pour convertir une URL de données en Blob
function dataURItoBlob(dataURI: string) {
  // Séparer le type MIME de la donnée
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // Écrire le contenu dans un tableau d'octets
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Créer un blob avec le type MIME approprié
  return new Blob([ab], { type: mimeString });
}
