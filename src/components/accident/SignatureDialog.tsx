
import React, { useState, useRef } from 'react';
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
  const canvasRefA = useRef<HTMLCanvasElement>(null);
  const canvasRefB = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureA, setSignatureA] = useState<string | null>(null);
  const [signatureB, setSignatureB] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("vehicle-a");

  // Drawing functions for each canvas
  const startDrawing = () => setIsDrawing(true);
  const stopDrawing = () => setIsDrawing(false);

  const drawOnCanvas = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  // Handle canvas touch events for mobile
  const handleTouchStart = (canvasRef: React.RefObject<HTMLCanvasElement>) => (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while drawing
    startDrawing();
    drawOnCanvas(e, canvasRef);
  };
  
  const handleTouchMove = (canvasRef: React.RefObject<HTMLCanvasElement>) => (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling while drawing
    drawOnCanvas(e, canvasRef);
  };

  const clearCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>, setSignature: React.Dispatch<React.SetStateAction<string | null>>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setSignature(null);
  };

  const saveSignature = (canvasRef: React.RefObject<HTMLCanvasElement>, setSignature: React.Dispatch<React.SetStateAction<string | null>>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save the signature as a data URL
    const dataURL = canvas.toDataURL();
    setSignature(dataURL);
    
    // Switch to the next tab or complete if both signatures are done
    if (activeTab === "vehicle-a") {
      setActiveTab("vehicle-b");
    } else if (signatureA) {
      // Both signatures are ready
      onSignaturesComplete({
        partyA: signatureA,
        partyB: dataURL
      });
    }
  };

  const handleComplete = () => {
    // Only complete if both signatures are captured
    if (signatureA && signatureB) {
      onSignaturesComplete({
        partyA: signatureA,
        partyB: signatureB
      });
    } else if (!signatureA && activeTab === "vehicle-a") {
      // Save current signature A first
      saveSignature(canvasRefA, setSignatureA);
    } else if (!signatureB && activeTab === "vehicle-b") {
      // Save current signature B first
      saveSignature(canvasRefB, setSignatureB);
    }
  };

  // Initialize canvases when the dialog opens
  React.useEffect(() => {
    if (open) {
      const setupCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Set canvas dimensions
        const parentRect = canvas.parentElement?.getBoundingClientRect();
        if (parentRect) {
          canvas.width = parentRect.width;
          canvas.height = 200; // Fixed height
        }
        
        // Set initial properties
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.beginPath();
      };
      
      setupCanvas(canvasRefA);
      setupCanvas(canvasRefB);
    }
  }, [open, activeTab]);

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
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {signatureA ? (
                <div className="p-2">
                  <img src={signatureA} alt="Signature du conducteur A" className="mx-auto" />
                </div>
              ) : (
                <canvas
                  ref={canvasRefA}
                  className="w-full h-[200px] bg-white touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={(e) => drawOnCanvas(e, canvasRefA)}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart(canvasRefA)}
                  onTouchMove={handleTouchMove(canvasRefA)}
                  onTouchEnd={stopDrawing}
                ></canvas>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => clearCanvas(canvasRefA, setSignatureA)}
              >
                Effacer
              </Button>
              <Button
                onClick={() => saveSignature(canvasRefA, setSignatureA)}
                disabled={!!signatureA}
              >
                {signatureA ? "Signature enregistrée" : "Enregistrer la signature"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="vehicle-b" className="space-y-4">
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {signatureB ? (
                <div className="p-2">
                  <img src={signatureB} alt="Signature du conducteur B" className="mx-auto" />
                </div>
              ) : (
                <canvas
                  ref={canvasRefB}
                  className="w-full h-[200px] bg-white touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={(e) => drawOnCanvas(e, canvasRefB)}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart(canvasRefB)}
                  onTouchMove={handleTouchMove(canvasRefB)}
                  onTouchEnd={stopDrawing}
                ></canvas>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => clearCanvas(canvasRefB, setSignatureB)}
              >
                Effacer
              </Button>
              <Button
                onClick={() => saveSignature(canvasRefB, setSignatureB)}
                disabled={!!signatureB}
              >
                {signatureB ? "Signature enregistrée" : "Enregistrer la signature"}
              </Button>
            </div>
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
