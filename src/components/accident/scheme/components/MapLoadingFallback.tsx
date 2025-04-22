
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw, HelpCircle } from "lucide-react";

interface MapLoadingFallbackProps {
  initAttempts: number;
  onRetry: () => void;
  onOpenDiagnostics: () => void;
}

const MapLoadingFallback: React.FC<MapLoadingFallbackProps> = ({
  initAttempts,
  onRetry,
  onOpenDiagnostics,
}) => (
  <div className="w-full h-full bg-gray-100">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="text-gray-500 mb-2">Chargement de la carte...</div>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-constalib-blue"></div>
      {initAttempts > 1 && (
        <div className="mt-4">
          <p className="text-sm text-amber-600 mb-2">Le chargement semble prendre du temps...</p>
          <div className="flex space-x-2">
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Forcer le rechargement
            </Button>
            <Button onClick={onOpenDiagnostics} variant="outline" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Diagnostic
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default MapLoadingFallback;
