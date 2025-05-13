
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PenLine, Save, RotateCcw } from 'lucide-react';

interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  title?: string;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onClose,
  onSave,
  title = "Signature du constat"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDraw, setHasDraw] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDraw(true);
    
    // Get position
    let x, y;
    if ((e as React.TouchEvent).touches) {
      const touch = (e as React.TouchEvent).touches[0];
      const rect = canvas.getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const mouseEvent = e as React.MouseEvent;
      const rect = canvas.getBoundingClientRect();
      x = mouseEvent.clientX - rect.left;
      y = mouseEvent.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position
    let x, y;
    if ((e as React.TouchEvent).touches) {
      const touch = (e as React.TouchEvent).touches[0];
      const rect = canvas.getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const mouseEvent = e as React.MouseEvent;
      const rect = canvas.getBoundingClientRect();
      x = mouseEvent.clientX - rect.left;
      y = mouseEvent.clientY - rect.top;
    }
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDraw(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDraw) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PenLine className="h-5 w-5 mr-2" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Veuillez signer dans le cadre ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-1 bg-gray-50">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="border border-gray-300 rounded bg-white touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={clearCanvas}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Effacer
          </Button>
          <Button 
            type="submit" 
            onClick={saveSignature} 
            disabled={!hasDraw}
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
