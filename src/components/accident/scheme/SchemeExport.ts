
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
