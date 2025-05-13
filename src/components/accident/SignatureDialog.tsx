
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (partyA: string | null, partyB: string | null) => void;
}

const SignatureDialog = ({ open, onOpenChange, onSign }: SignatureDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>("partyA");
  const [signatureA, setSignatureA] = useState<string | null>(null);
  const [signatureB, setSignatureB] = useState<string | null>(null);

  const handleSign = () => {
    onSign(signatureA, signatureB);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter des signatures</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partyA">Partie A</TabsTrigger>
            <TabsTrigger value="partyB">Partie B</TabsTrigger>
          </TabsList>
          
          <TabsContent value="partyA" className="p-4 border rounded-md mt-2">
            <div className="flex flex-col items-center">
              <div className="border border-dashed border-gray-300 rounded-md p-4 w-full h-32 flex items-center justify-center mb-2">
                {signatureA ? (
                  <img src={signatureA} alt="Signature partie A" className="max-h-full" />
                ) : (
                  <p className="text-gray-500">Signature ici</p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSignatureA("data:image/png;base64,...")}
                className="w-full"
              >
                Signer
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="partyB" className="p-4 border rounded-md mt-2">
            <div className="flex flex-col items-center">
              <div className="border border-dashed border-gray-300 rounded-md p-4 w-full h-32 flex items-center justify-center mb-2">
                {signatureB ? (
                  <img src={signatureB} alt="Signature partie B" className="max-h-full" />
                ) : (
                  <p className="text-gray-500">Signature ici</p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSignatureB("data:image/png;base64,...")}
                className="w-full"
              >
                Signer
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Annuler</Button>
          <Button onClick={handleSign}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
