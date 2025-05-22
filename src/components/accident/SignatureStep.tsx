
import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, CarTaxiFront, FileSignature, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SignatureStepProps {
  signatureA: string;
  signatureB: string;
  signatureDateA: string;
  signatureDateB: string;
  setSignature: (signature: string, party: 'A' | 'B') => void;
}

const SignatureStep = ({
  signatureA,
  signatureB,
  signatureDateA,
  signatureDateB,
  setSignature
}: SignatureStepProps) => {
  const [activeTab, setActiveTab] = useState("vehicle-a");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Scale canvas for better resolution
    const scale = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    
    context.scale(scale, scale);
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    context.lineCap = "round";
    contextRef.current = context;

    // Clear canvas
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (nativeEvent: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    setIsDrawing(true);
    
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (nativeEvent: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // Save the signature
    const dataURL = canvasRef.current.toDataURL("image/png");
    setSignature(dataURL, activeTab === "vehicle-a" ? "A" : "B");
  };

  const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    let offsetX, offsetY;
    const rect = canvas.getBoundingClientRect();

    if ('touches' in event) {
      // Touch event
      offsetX = event.touches[0].clientX - rect.left;
      offsetY = event.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      offsetX = event.nativeEvent.offsetX;
      offsetY = event.nativeEvent.offsetY;
    }

    return { offsetX, offsetY };
  };

  const clearSignature = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    contextRef.current.clearRect(
      0, 
      0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    contextRef.current.fillStyle = "#ffffff";
    contextRef.current.fillRect(
      0, 
      0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    setSignature("", activeTab === "vehicle-a" ? "A" : "B");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "PPP 'à' HH'h'mm", { locale: fr });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          // Reset canvas when switching tabs
          setTimeout(initializeCanvas, 0);
        }}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="vehicle-a" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Signature A (Vous)
          </TabsTrigger>
          <TabsTrigger value="vehicle-b" className="flex items-center">
            <CarTaxiFront className="mr-2 h-4 w-4" />
            Signature B (Autre)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle-a">
          <SignaturePanel
            signature={signatureA}
            signatureDate={signatureDateA}
            canvasRef={canvasRef}
            initializeCanvas={initializeCanvas}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
            clearSignature={clearSignature}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="vehicle-b">
          <SignaturePanel
            signature={signatureB}
            signatureDate={signatureDateB}
            canvasRef={canvasRef}
            initializeCanvas={initializeCanvas}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
            clearSignature={clearSignature}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SignaturePanelProps {
  signature: string;
  signatureDate: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initializeCanvas: () => void;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  clearSignature: () => void;
  formatDate: (date: string) => string;
}

const SignaturePanel = ({
  signature,
  signatureDate,
  canvasRef,
  initializeCanvas,
  startDrawing,
  draw,
  stopDrawing,
  clearSignature,
  formatDate
}: SignaturePanelProps) => {
  // Initialize canvas on component mount
  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  return (
    <div className="space-y-6">
      {signature ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="text-lg font-medium">Signature enregistrée</h3>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSignature}
              >
                Modifier
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <img 
                src={signature} 
                alt="Signature" 
                className="max-h-32 mb-4" 
              />
              
              <div className="flex items-center text-sm text-constalib-dark-gray">
                <Calendar className="h-4 w-4 mr-1" />
                Signé le {formatDate(signatureDate)}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center mb-2">
              <FileSignature className="h-5 w-5 mr-2 text-constalib-blue" />
              <h3 className="text-lg font-medium">Signez ci-dessous</h3>
            </div>
            
            <div className="border rounded-lg p-1 bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="w-full h-48 cursor-crosshair touch-none"
                style={{ minHeight: "200px" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={clearSignature}
              >
                Effacer
              </Button>
            </div>
            
            <p className="text-sm text-center text-constalib-dark-gray">
              En signant, vous certifiez l'exactitude des informations fournies.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignatureStep;
