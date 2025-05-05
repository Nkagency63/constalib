
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface ExportImageProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

export const handleExportImage = async ({ mapRef }: ExportImageProps) => {
  if (!mapRef.current) {
    toast.error("Impossible d'exporter la carte");
    return;
  }

  try {
    toast.info("Préparation de l'image...");
    
    // Récupérer le conteneur de la carte Leaflet
    const mapContainer = mapRef.current.getContainer();
    
    // Utiliser html2canvas pour générer l'image
    const canvas = await html2canvas(mapContainer, {
      useCORS: true, // Permettre le chargement des tuiles de carte à partir d'autres domaines
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      scale: 2, // Meilleure qualité
    });
    
    // Convertir le canvas en URL de données
    const imageUrl = canvas.toDataURL('image/png');
    
    // Créer un élément pour télécharger l'image
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = `accident-schema-${new Date().toISOString().slice(0,10)}.png`;
    
    // Déclencher le téléchargement
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success("Image exportée avec succès");
  } catch (error) {
    toast.error("Erreur lors de l'exportation de l'image");
    console.error("Erreur d'exportation:", error);
  }
};

// Fonction pour capturer le schéma sans téléchargement - utilisé pour le CERFA
export const captureSchemeAsDataUrl = async (): Promise<string | null> => {
  try {
    // Trouver le conteneur de la carte
    const schemeContainer = document.querySelector('.leaflet-container') as HTMLElement;
    
    if (!schemeContainer) {
      console.warn("Conteneur de schéma introuvable");
      return null;
    }
    
    // Attendre les rendus en cours
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Paramètres améliorés pour une meilleure qualité
    const canvas = await html2canvas(schemeContainer, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scale: 2.5,
      logging: false,
      width: schemeContainer.offsetWidth,
      height: schemeContainer.offsetHeight,
    });
    
    // Convertir en URL de données avec haute qualité
    return canvas.toDataURL('image/png', 0.95);
  } catch (error) {
    console.error("Erreur lors de la capture du schéma:", error);
    return null;
  }
};
