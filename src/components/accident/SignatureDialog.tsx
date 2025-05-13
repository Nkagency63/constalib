
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (partyA: string | null, partyB: string | null) => void;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onSign,
}) => {
  const [signatureA, setSignatureA] = React.useState<string | null>(null);
  const [signatureB, setSignatureB] = React.useState<string | null>(null);

  const handleSign = () => {
    onSign(signatureA, signatureB);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter des signatures</DialogTitle>
          <DialogDescription>
            Signez le constat pour les deux parties concernées
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Signature partie A</h3>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
              {signatureA ? (
                <img src={signatureA} alt="Signature A" className="max-h-full" />
              ) : (
                <p className="text-gray-400">Zone de signature</p>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSignatureA("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")}
              className="w-full"
            >
              Signer
            </Button>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Signature partie B</h3>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
              {signatureB ? (
                <img src={signatureB} alt="Signature B" className="max-h-full" />
              ) : (
                <p className="text-gray-400">Zone de signature</p>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSignatureB("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")}
              className="w-full"
            >
              Signer
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSign}>
            Valider les signatures
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
