
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenLine, CheckCircle, UserCircle } from 'lucide-react';
import SignatureModal from '../SignatureModal';

interface SignatureSectionProps {
  onSignaturesUpdate: (signatures: { partyA: string | null; partyB: string | null }) => void;
}

const SignatureSection = ({ onSignaturesUpdate }: SignatureSectionProps) => {
  const [partyASignature, setPartyASignature] = useState<string | null>(null);
  const [partyBSignature, setPartyBSignature] = useState<string | null>(null);
  const [partyAModalOpen, setPartyAModalOpen] = useState(false);
  const [partyBModalOpen, setPartyBModalOpen] = useState(false);
  
  const handlePartyASignature = (signatureDataUrl: string) => {
    setPartyASignature(signatureDataUrl);
    onSignaturesUpdate({
      partyA: signatureDataUrl,
      partyB: partyBSignature
    });
  };
  
  const handlePartyBSignature = (signatureDataUrl: string) => {
    setPartyBSignature(signatureDataUrl);
    onSignaturesUpdate({
      partyA: partyASignature,
      partyB: signatureDataUrl
    });
  };
  
  return (
    <div className="space-y-6 my-8">
      <h3 className="text-xl font-semibold text-constalib-dark">Signatures</h3>
      <p className="text-constalib-dark-gray mb-4">
        Le constat doit être signé par les deux parties impliquées dans l'accident.
        Chacune des parties doit apposer sa signature électronique ci-dessous.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signature Party A */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserCircle className="w-5 h-5 text-constalib-blue mr-2" />
                <h4 className="font-medium">Conducteur A</h4>
              </div>
              {partyASignature ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Signé</span>
                </div>
              ) : (
                <div className="text-amber-500 text-sm">En attente</div>
              )}
            </div>
            
            {partyASignature ? (
              <div className="border rounded-md p-2 bg-gray-50">
                <img 
                  src={partyASignature} 
                  alt="Signature Conducteur A" 
                  className="max-h-20 mx-auto"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md h-20 flex items-center justify-center text-gray-400">
                Aucune signature
              </div>
            )}
            
            <Button
              variant={partyASignature ? "outline" : "default"}
              className="w-full mt-4"
              onClick={() => setPartyAModalOpen(true)}
            >
              <PenLine className="w-4 h-4 mr-2" />
              {partyASignature ? "Modifier la signature" : "Signer (conducteur A)"}
            </Button>
          </CardContent>
        </Card>
        
        {/* Signature Party B */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserCircle className="w-5 h-5 text-constalib-blue mr-2" />
                <h4 className="font-medium">Conducteur B</h4>
              </div>
              {partyBSignature ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Signé</span>
                </div>
              ) : (
                <div className="text-amber-500 text-sm">En attente</div>
              )}
            </div>
            
            {partyBSignature ? (
              <div className="border rounded-md p-2 bg-gray-50">
                <img 
                  src={partyBSignature} 
                  alt="Signature Conducteur B" 
                  className="max-h-20 mx-auto"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md h-20 flex items-center justify-center text-gray-400">
                Aucune signature
              </div>
            )}
            
            <Button
              variant={partyBSignature ? "outline" : "default"}
              className="w-full mt-4"
              onClick={() => setPartyBModalOpen(true)}
            >
              <PenLine className="w-4 h-4 mr-2" />
              {partyBSignature ? "Modifier la signature" : "Signer (conducteur B)"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Signature Modals */}
      <SignatureModal
        open={partyAModalOpen}
        onOpenChange={setPartyAModalOpen}
        onSignatureComplete={handlePartyASignature}
        partyLabel="Conducteur A"
      />
      
      <SignatureModal
        open={partyBModalOpen}
        onOpenChange={setPartyBModalOpen}
        onSignatureComplete={handlePartyBSignature}
        partyLabel="Conducteur B"
      />
    </div>
  );
};

export default SignatureSection;
