
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignaturePad from './SignaturePad';

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignaturesComplete: (signatures: { partyA: string, partyB: string }) => void;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onSignaturesComplete,
}) => {
  const [signatureA, setSignatureA] = useState<string | null>(null);
  const [signatureB, setSignatureB] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("vehicle-a");

  const handleComplete = () => {
    if (signatureA && signatureB) {
      onSignaturesComplete({
        partyA: signatureA,
        partyB: signatureB
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signatures des Parties</DialogTitle>
          <DialogDescription>
            Chaque conducteur impliqué dans l'accident doit signer pour valider le constat.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="vehicle-a">
              Conducteur Véhicule A
              {signatureA && <span className="ml-2 text-green-500">✓</span>}
            </TabsTrigger>
            <TabsTrigger value="vehicle-b">
              Conducteur Véhicule B
              {signatureB && <span className="ml-2 text-green-500">✓</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicle-a" className="space-y-4">
            <SignaturePad
              onSave={setSignatureA}
              initialValue={signatureA || undefined}
              label="Signature du conducteur véhicule A"
            />
            
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  if (signatureA) setActiveTab("vehicle-b");
                }}
                disabled={!signatureA}
              >
                Suivant
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="vehicle-b" className="space-y-4">
            <SignaturePad
              onSave={setSignatureB}
              initialValue={signatureB || undefined}
              label="Signature du conducteur véhicule B"
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            onClick={handleComplete} 
            disabled={!signatureA || !signatureB}
          >
            Valider les signatures
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
