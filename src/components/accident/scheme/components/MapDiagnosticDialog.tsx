
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface MapDiagnosticDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: {
    mapLoaded: boolean;
    mapReady: boolean;
    isLoading: boolean;
    mapError: string | null;
    containerExists: boolean;
    initAttempts: number;
    lat: number | null;
    lng: number | null;
    getDiagnosticInfo: () => string;
  };
  onRetry: () => void;
}

const MapDiagnosticDialog: React.FC<MapDiagnosticDialogProps> = ({
  open,
  onOpenChange,
  state,
  onRetry,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Informations de diagnostic</DialogTitle>
        <DialogDescription>
          Ces informations peuvent aider à résoudre les problèmes de chargement de la carte.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2 my-4">
        <div className="text-sm">
          <h4 className="font-medium mb-1">État actuel:</h4>
          <ul className="ml-5 list-disc space-y-1">
            <li>Carte chargée: {state.mapLoaded ? "Oui" : "Non"}</li>
            <li>Composant prêt: {state.mapReady ? "Oui" : "Non"}</li>
            <li>En chargement: {state.isLoading ? "Oui" : "Non"}</li>
            <li>Erreur: {state.mapError || "Aucune"}</li>
            <li>Conteneur disponible: {state.containerExists ? "Oui" : "Non"}</li>
            <li>Tentatives d'initialisation: {state.initAttempts}</li>
            <li>Coordonnées: {state.lat && state.lng ? `${state.lat.toFixed(5)}, ${state.lng.toFixed(5)}` : "Non définies"}</li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-medium mb-1">Informations techniques :</h4>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto whitespace-pre-wrap">
            {state.getDiagnosticInfo()}
          </pre>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onRetry} className="mr-2">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Réinitialiser la carte
        </Button>
        <Button onClick={() => onOpenChange(false)} variant="secondary">
          Fermer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default MapDiagnosticDialog;
