
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pen, Check } from 'lucide-react';
import SignatureModal from '../SignatureModal';

interface SignatureSectionProps {
  onSignaturesUpdate: (signatures: { partyA: string | null; partyB: string | null }) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ onSignaturesUpdate }) => {
  const [showPartyAModal, setShowPartyAModal] = useState(false);
  const [showPartyBModal, setShowPartyBModal] = useState(false);
  const [partyASignature, setPartyASignature] = useState<string | null>(null);
  const [partyBSignature, setPartyBSignature] = useState<string | null>(null);
  
  const handlePartyASignature = (signatureDataUrl: string) => {
    setPartyASignature(signatureDataUrl);
    onSignaturesUpdate({ partyA: signatureDataUrl, partyB: partyBSignature });
  };
  
  const handlePartyBSignature = (signatureDataUrl: string) => {
    setPartyBSignature(signatureDataUrl);
    onSignaturesUpdate({ partyA: partyASignature, partyB: signatureDataUrl });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-constalib-dark">Signatures</h3>
      <p className="text-sm text-constalib-dark-gray mb-4">
        Les deux parties impliquées dans l'accident doivent signer ce constat. Les signatures électroniques sont horodatées et juridiquement valables.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Partie A */}
        <div className="border rounded-md p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Conducteur A (vous)</h4>
            {partyASignature && <Check className="h-5 w-5 text-green-500" />}
          </div>
          
          {partyASignature ? (
            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <img src={partyASignature} alt="Signature partie A" className="h-16 w-auto mx-auto" />
              <p className="text-xs text-center text-gray-500 mt-2">Signature enregistrée</p>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPartyAModal(true)}
            >
              <Pen className="w-4 h-4 mr-2" />
              Signer (Partie A)
            </Button>
          )}
        </div>
        
        {/* Partie B */}
        <div className="border rounded-md p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Conducteur B (autre partie)</h4>
            {partyBSignature && <Check className="h-5 w-5 text-green-500" />}
          </div>
          
          {partyBSignature ? (
            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <img src={partyBSignature} alt="Signature partie B" className="h-16 w-auto mx-auto" />
              <p className="text-xs text-center text-gray-500 mt-2">Signature enregistrée</p>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPartyBModal(true)}
            >
              <Pen className="w-4 h-4 mr-2" />
              Signer (Partie B)
            </Button>
          )}
        </div>
      </div>
      
      <SignatureModal
        open={showPartyAModal}
        onOpenChange={setShowPartyAModal}
        onSignatureComplete={handlePartyASignature}
        partyLabel="Partie A"
      />
      
      <SignatureModal
        open={showPartyBModal}
        onOpenChange={setShowPartyBModal}
        onSignatureComplete={handlePartyBSignature}
        partyLabel="Partie B"
      />
    </div>
  );
};

export default SignatureSection;
