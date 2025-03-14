
import { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import Button from './Button';

interface PhotoCaptureProps {
  onPhotoCapture: (imageFile: File) => void;
  label?: string;
}

const PhotoCapture = ({ onPhotoCapture, label = "Ajouter une photo" }: PhotoCaptureProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onPhotoCapture(file);
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert the canvas image to a file
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setPreviewUrl(imageUrl);
      onPhotoCapture(file);
      stopCamera();
    }, 'image/jpeg', 0.8);
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium mb-2 text-constalib-dark">{label}</p>}
      
      {/* Preview area */}
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden mb-3">
          <img
            src={previewUrl}
            alt="Photo preview"
            className="w-full object-cover"
          />
          <button
            onClick={removePhoto}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
            aria-label="Remove photo"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ) : isCapturing ? (
        <div className="relative bg-black rounded-lg overflow-hidden mb-3">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-3 bg-black/50">
            <Button
              onClick={capturePhoto}
              className="rounded-full bg-white p-2"
              aria-label="Take photo"
            >
              <Check className="w-5 h-5 text-constalib-blue" />
            </Button>
            <Button
              onClick={stopCamera}
              variant="ghost"
              className="rounded-full"
              aria-label="Cancel"
            >
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            onClick={startCamera}
            variant="outline"
            className="w-full justify-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Prendre une photo
          </Button>
          <Button
            onClick={triggerFileInput}
            variant="outline"
            className="w-full justify-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Importer une image
          </Button>
        </div>
      )}
      
      {/* Hidden elements */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;
