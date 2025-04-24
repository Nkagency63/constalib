
import { useCallback, useState, RefObject } from "react";
import L from "leaflet";

interface DiagnosticInfo {
  browserInfo: string;
  screenDimensions: string;
  containerDimensions: string;
  tilesLoaded: boolean;
  leafletVersion: string;
  initializationTime: number;
}

export function useMapDiagnostics(mapRef: RefObject<HTMLDivElement>) {
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo | null>(null);

  const collectDiagnostics = useCallback(() => {
    const browserInfo = navigator.userAgent;
    const screenDimensions = `${window.innerWidth}x${window.innerHeight}`;
    const leafletVersion = L.version || "unknown";

    setDiagnosticInfo(prev => ({
      ...prev,
      browserInfo,
      screenDimensions,
      leafletVersion,
      containerDimensions: mapRef.current ?
        `${mapRef.current.clientWidth}x${mapRef.current.clientHeight}` :
        "unknown",
      tilesLoaded: false,
      initializationTime: 0
    }));
  }, [mapRef]);

  const getDiagnosticInfo = useCallback(() => {
    if (!diagnosticInfo) return "Information de diagnostic non disponible";
    return `
      Navigateur: ${diagnosticInfo.browserInfo.substring(0, 50)}...
      Écran: ${diagnosticInfo.screenDimensions}
      Conteneur carte: ${diagnosticInfo.containerDimensions}
      Version Leaflet: ${diagnosticInfo.leafletVersion}
      Tuiles chargées: ${diagnosticInfo.tilesLoaded ? "Oui" : "Non"}
      Temps d'initialisation: ${diagnosticInfo.initializationTime}ms
    `;
  }, [diagnosticInfo]);

  const updateDiagnostics = (fields: Partial<DiagnosticInfo>) => {
    setDiagnosticInfo(prev => prev ? { ...prev, ...fields } : null);
  };

  return { diagnosticInfo, collectDiagnostics, getDiagnosticInfo, updateDiagnostics, setDiagnosticInfo };
}
