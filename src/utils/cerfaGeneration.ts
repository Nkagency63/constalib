
import { FormData } from "@/components/accident/types";
import { toast } from "sonner";

/**
 * Génère un PDF de constat amiable pré-rempli avec les données du formulaire
 * @param formData Données du formulaire pour pré-remplir le constat
 * @returns Promise qui résoud vers l'URL du PDF généré
 */
export const generateCerfaPDF = async (formData: FormData): Promise<string> => {
  try {
    // Cette fonction est un placeholder pour le moment
    // Dans une implémentation réelle, on enverrait les données à un service
    // qui générerait un PDF pré-rempli

    // Pour l'instant, on renvoie simplement le chemin vers le PDF vierge
    return "/pdf/constat-amiable-vierge.pdf";
  } catch (error: any) {
    console.error("Erreur lors de la génération du CERFA:", error);
    toast.error("Impossible de générer le PDF du constat amiable");
    throw new Error("Erreur lors de la génération du CERFA");
  }
};
