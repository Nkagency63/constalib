
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface MapDiagnosticDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
  mapLoaded: boolean;
  isLoading: boolean;
  mapError: string | null;
  initAttempts: number;
  lat: number | null;
  lng: number | null;
  diagnosticInfo: string;
}

const MapDiagnosticDialog = ({
  open,
  onOpenChange,
  onRetry,
  mapLoaded,
  isLoading,
  mapError,
  initAttempts,
  lat,
  lng,
  diagnosticInfo
}: MapDiagnosticDialogProps) => {
  return (
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
              <li>Carte chargée: {mapLoaded ? 'Oui' : 'Non'}</li>
              <li>En chargement: {isLoading ? 'Oui' : 'Non'}</li>
              <li>Erreur: {mapError || 'Aucune'}</li>
              <li>Tentatives d'initialisation: {initAttempts}</li>
              <li>Coordonnées: {lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Non définies'}</li>
            </ul>
          </div>
          
          <div className="text-sm">
            <h4 className="font-medium mb-1">Informations techniques:</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto whitespace-pre-wrap">
              {diagnosticInfo}
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
};

export default MapDiagnosticDialog;
