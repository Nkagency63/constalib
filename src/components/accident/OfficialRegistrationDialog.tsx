
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

export interface OfficialRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => Promise<void>;
  isRegistering: boolean;
}

const OfficialRegistrationDialog: React.FC<OfficialRegistrationDialogProps> = ({
  open,
  onOpenChange,
  onRegister,
  isRegistering,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrement officiel</DialogTitle>
          <DialogDescription>
            Votre constat sera enregistré officiellement et transmis aux assurances concernées
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">
            En validant, vous acceptez que votre constat soit transmis au format électronique
            aux parties suivantes :
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Votre compagnie d'assurance</li>
            <li>La compagnie d'assurance de la partie adverse</li>
            <li>La plateforme e-constat auto</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            Un email de confirmation vous sera envoyé avec votre numéro de référence unique.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRegistering}>
            Annuler
          </Button>
          <Button onClick={onRegister} disabled={isRegistering}>
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfficialRegistrationDialog;
