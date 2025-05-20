
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pen, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import SignaturePad from './SignaturePad';

interface SignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignatureComplete: (signatureDataUrl: string) => void;
  partyLabel: string;
}

const SignatureModal = ({ open, onOpenChange, onSignatureComplete, partyLabel }: SignatureModalProps) => {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  
  const handleSaveSignature = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
  };
  
  const handleSubmit = () => {
    if (!signatureDataUrl) {
      toast.warning("Veuillez signer avant de valider");
      return;
    }
    
    onSignatureComplete(signatureDataUrl);
    toast.success(`Signature ${partyLabel} enregistrée`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signature {partyLabel}</DialogTitle>
        </DialogHeader>
        
        <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
          <AlertDescription className="text-blue-700 text-sm">
            Signez dans la zone ci-dessous à l'aide de votre doigt ou de votre souris. Cette signature certifie votre accord avec les informations du constat.
          </AlertDescription>
        </Alert>
        
        <SignaturePad
          onSave={handleSaveSignature}
          height={200}
          label=""
        />
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!signatureDataUrl}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Valider la signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
