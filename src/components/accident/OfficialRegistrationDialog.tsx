
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface OfficialRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => void;
  isRegistering: boolean;
}

const OfficialRegistrationDialog = ({ 
  open, 
  onOpenChange, 
  onRegister, 
  isRegistering 
}: OfficialRegistrationDialogProps) => {
  const [consentsGiven, setConsentsGiven] = useState({
    dataConsent: false,
    termsConsent: false,
    sharingConsent: false,
  });

  const allConsentsGiven = Object.values(consentsGiven).every(Boolean);

  const handleCheckboxChange = (id: keyof typeof consentsGiven) => {
    setConsentsGiven(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Enregistrement officiel du constat</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-600">
            Vous êtes sur le point d'enregistrer officiellement votre constat amiable d'accident. Cette action enverra votre constat aux services d'assurance concernés (e-constat auto).
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="dataConsent" 
                checked={consentsGiven.dataConsent}
                onCheckedChange={() => handleCheckboxChange('dataConsent')}
              />
              <Label htmlFor="dataConsent" className="text-sm leading-tight">
                Je consens au traitement de mes données personnelles dans le cadre de ce constat d'accident.
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="termsConsent" 
                checked={consentsGiven.termsConsent}
                onCheckedChange={() => handleCheckboxChange('termsConsent')}
              />
              <Label htmlFor="termsConsent" className="text-sm leading-tight">
                J'accepte les conditions générales d'utilisation du service e-constat auto.
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="sharingConsent" 
                checked={consentsGiven.sharingConsent}
                onCheckedChange={() => handleCheckboxChange('sharingConsent')}
              />
              <Label htmlFor="sharingConsent" className="text-sm leading-tight">
                J'autorise le partage de ce constat avec les compagnies d'assurance concernées.
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline" disabled={isRegistering}>
            Annuler
          </Button>
          <Button onClick={onRegister} disabled={!allConsentsGiven || isRegistering}>
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
