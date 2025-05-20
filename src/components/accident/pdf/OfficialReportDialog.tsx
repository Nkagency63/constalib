
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OfficialReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
  referenceId: string;
  isSuccess: boolean;
}

const OfficialReportDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
  referenceId,
  isSuccess
}: OfficialReportDialogProps) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Enregistrement Officiel du Constat</DialogTitle>
        <DialogDescription>
          {referenceId ? (
            <div className="space-y-4 mt-4">
              <p>Votre constat a été enregistré avec succès sous la référence :</p>
              <p className="bg-green-50 border border-green-200 rounded-md p-3 text-center font-bold text-green-800">
                {referenceId}
              </p>
              <p>
                Cette référence est votre preuve d'enregistrement. Conservez-la précieusement
                et communiquez-la à votre assurance.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <p>
                En cliquant sur "Enregistrer", vous déclarerez officiellement ce constat
                dans le système e-constat.
              </p>
              <p>
                Cette action a une valeur juridique et remplacera le constat papier.
                Un numéro de référence unique vous sera attribué.
              </p>
              <p className="font-semibold text-amber-600">
                Veuillez vérifier que toutes les informations sont correctes avant de confirmer.
              </p>
            </div>
          )}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="sm:justify-between">
        <DialogClose asChild>
          <Button variant="outline">
            {referenceId ? "Fermer" : "Annuler"}
          </Button>
        </DialogClose>
        
        {!referenceId && (
          <Button 
            onClick={onConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? "Enregistrement..." : "Enregistrer"}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default OfficialReportDialog;
