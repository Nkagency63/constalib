
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pen, Save, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface SignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignatureComplete: (signatureDataUrl: string) => void;
  partyLabel: string;
}

const SignatureModal = ({ open, onOpenChange, onSignatureComplete, partyLabel }: SignatureModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSignature(true);
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  
  const saveSignature = () => {
    if (!hasSignature) {
      toast.warning("Veuillez signer avant de valider");
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureDataUrl = canvas.toDataURL('image/png');
    onSignatureComplete(signatureDataUrl);
    toast.success(`Signature ${partyLabel} enregistrée`);
    onOpenChange(false);
  };
  
  // Make sure canvas is properly sized when the modal opens
  React.useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 200; // Fixed height
      }
    }
  }, [open]);
  
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
        
        <div className="border-2 border-dashed border-gray-300 rounded-md p-2 bg-white">
          <canvas 
            ref={canvasRef} 
            className="w-full touch-none" 
            style={{ height: '200px' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
        
        <div className="flex justify-center mt-2 gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearSignature}
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Effacer
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          
          <Button 
            onClick={saveSignature}
            disabled={!hasSignature}
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
