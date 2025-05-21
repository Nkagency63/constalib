
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface GeolocationHookResult {
  center: [number, number];
  zoom: number;
  isLoading: boolean;
  error: string | null;
}

interface GeolocationHookProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onLocationUpdate?: (center: [number, number], zoom: number, address?: string) => void;
}

export const useGeolocation = ({
  initialCenter = [48.8566, 2.3522], // Paris par défaut
  initialZoom = 13,
  onLocationUpdate
}: GeolocationHookProps = {}): GeolocationHookResult => {
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Geolocation successful:", latitude, longitude);
          
          // Mettre à jour les coordonnées du centre et le zoom
          const newCenter: [number, number] = [latitude, longitude];
          const newZoom = 17;
          
          setCenter(newCenter);
          setZoom(newZoom);
          
          // Effectuer le géocodage inverse avec Nominatim
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'accept-language': 'fr' } }
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = data.display_name;
              console.log("Reverse geocoding successful:", address);
              
              // Appeler le callback si fourni
              if (onLocationUpdate) {
                onLocationUpdate(newCenter, newZoom, address);
              }
              
              toast("Position géographique détectée: " + address);
            } else {
              console.error("Reverse geocoding failed:", response.statusText);
              toast("Position géographique détectée");
              
              if (onLocationUpdate) {
                onLocationUpdate(newCenter, newZoom);
              }
            }
          } catch (error) {
            console.error("Error during reverse geocoding:", error);
            toast("Position géographique détectée");
            
            if (onLocationUpdate) {
              onLocationUpdate(newCenter, newZoom);
            }
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setError("Impossible d'obtenir votre position");
          toast.error("Impossible d'obtenir votre position. Utilisation des coordonnées par défaut.");
          setIsLoading(false);
          
          // Conserver les coordonnées par défaut
          if (onLocationUpdate) {
            onLocationUpdate(initialCenter, initialZoom);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser");
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      
      // Conserver les coordonnées par défaut
      if (onLocationUpdate) {
        onLocationUpdate(initialCenter, initialZoom);
      }
    }
  }, [initialCenter, initialZoom, onLocationUpdate]);

  return { center, zoom, isLoading, error };
};
