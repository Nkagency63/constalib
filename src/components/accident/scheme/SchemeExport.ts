
import { toast } from 'sonner';

interface ExportImageProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

export const handleExportImage = ({ mapRef }: ExportImageProps) => {
  if (!mapRef.current) {
    toast.error("Impossible d'exporter la carte");
    return;
  }

  try {
    toast.info("Préparation de l'image...");
    toast.success("Export d'image simulé - cette fonctionnalité nécessite html2canvas");
  } catch (error) {
    toast.error("Erreur lors de l'exportation de l'image");
    console.error("Erreur d'exportation:", error);
  }
};
