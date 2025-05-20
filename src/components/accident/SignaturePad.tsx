
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Save, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  width?: number | string;
  height?: number;
  className?: string;
  label?: string;
  initialValue?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  width = '100%',
  height = 200,
  className = '',
  label = 'Signature',
  initialValue
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(!!initialValue);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setHasSignature(false);
    }
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL('image/png');
      onSave(dataURL);
      setHasSignature(true);
    }
  };

  const handleBegin = () => {
    setHasSignature(true);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {hasSignature && (
            <span className="text-xs text-green-600 font-medium">Signature présente</span>
          )}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-md p-2 bg-white">
        {initialValue ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <img 
              src={initialValue} 
              alt="Signature existante" 
              className="max-h-full" 
            />
          </div>
        ) : (
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width,
              height,
              className: "signature-canvas touch-none",
              style: { width: '100%', height }
            }}
            onBegin={handleBegin}
          />
        )}
      </div>

      {!initialValue && (
        <div className="flex justify-between mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clear}
            type="button"
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Effacer
          </Button>
          <Button
            onClick={save}
            type="button" 
            size="sm"
            disabled={!hasSignature}
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </Button>
        </div>
      )}

      {!hasSignature && !initialValue && (
        <Alert variant="default" className="bg-amber-50 border-amber-200 mt-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-xs">
            Veuillez signer dans la zone ci-dessus.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SignaturePad;
