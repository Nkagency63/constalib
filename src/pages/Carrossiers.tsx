
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Star, Navigation, Search } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Carrossier {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  horaires: string;
  note: number;
  distance?: number;
  latitude: number;
  longitude: number;
}

const mockCarrossiers: Carrossier[] = [
  {
    id: 1,
    nom: "Carrosserie Moderne",
    adresse: "12 Rue de la Réparation, 75011 Paris",
    telephone: "01 23 45 67 89",
    horaires: "Lun-Ven: 8h-19h, Sam: 9h-17h",
    note: 4.8,
    latitude: 48.859,
    longitude: 2.347
  },
  {
    id: 2,
    nom: "Auto Prestige Carrosserie",
    adresse: "45 Avenue des Techniques, 75015 Paris",
    telephone: "01 98 76 54 32",
    horaires: "Lun-Ven: 8h30-18h30",
    note: 4.5,
    latitude: 48.842,
    longitude: 2.327
  },
  {
    id: 3,
    nom: "Garage de la Place",
    adresse: "8 Place de l'Automobile, 75020 Paris",
    telephone: "01 45 67 89 12",
    horaires: "Lun-Sam: 7h30-20h",
    note: 4.2,
    latitude: 48.871,
    longitude: 2.398
  },
  {
    id: 4,
    nom: "Carrosserie Express",
    adresse: "23 Boulevard des Réparations, 92100 Boulogne-Billancourt",
    telephone: "01 56 78 90 12",
    horaires: "Lun-Ven: 9h-19h",
    note: 4.7,
    latitude: 48.833,
    longitude: 2.245
  },
  {
    id: 5,
    nom: "Auto Réparation Plus",
    adresse: "67 Rue du Service, 94200 Ivry-sur-Seine",
    telephone: "01 23 67 89 45",
    horaires: "Lun-Ven: 8h-20h, Sam: 9h-18h",
    note: 4.4,
    latitude: 48.816,
    longitude: 2.383
  }
];

const CarrossiersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carrossiers, setCarrossiers] = useState<Carrossier[]>(mockCarrossiers);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Fonction pour déterminer la position de l'utilisateur
  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas prise en charge par votre navigateur");
      setLocationLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Calculer la distance pour chaque carrossier et trier par distance
        const carrossiersWithDistance = mockCarrossiers.map(carrossier => {
          const distance = calculateDistance(
            latitude, 
            longitude, 
            carrossier.latitude, 
            carrossier.longitude
          );
          return { ...carrossier, distance };
        }).sort((a, b) => (a.distance || 999) - (b.distance || 999));
        
        setCarrossiers(carrossiersWithDistance);
        setLocationLoading(false);
        toast.success("Localisation effectuée avec succès");
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        let message = "Impossible d'obtenir votre position";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Vous avez refusé la demande de géolocalisation";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Informations de localisation indisponibles";
            break;
          case error.TIMEOUT:
            message = "La demande de localisation a expiré";
            break;
        }
        
        toast.error(message);
        setLocationLoading(false);
      }
    );
  };

  // Fonction pour calculer la distance entre deux points en km (formule de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance en km
    return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
  };

  // Fonction pour rechercher des carrossiers par ville ou code postal
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Veuillez entrer une ville ou un code postal");
      return;
    }
    
    setLoading(true);
    
    try {
      // Utiliser Nominatim pour géocoder l'adresse
      const response = await supabase.functions.invoke('geocode-location', {
        body: { address: searchQuery }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (response.data?.success && response.data?.data) {
        const { lat, lng } = response.data.data;
        setUserLocation({ lat, lng });
        
        // Calculer la distance pour chaque carrossier et trier par distance
        const carrossiersWithDistance = mockCarrossiers.map(carrossier => {
          const distance = calculateDistance(
            lat, 
            lng, 
            carrossier.latitude, 
            carrossier.longitude
          );
          return { ...carrossier, distance };
        }).sort((a, b) => (a.distance || 999) - (b.distance || 999));
        
        setCarrossiers(carrossiersWithDistance);
        toast.success(`Recherche effectuée pour "${searchQuery}"`);
      } else {
        toast.error("Aucun résultat trouvé pour cette recherche");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir des directions vers un carrossier
  const getDirections = (carrossier: Carrossier) => {
    if (!userLocation) {
      toast.error("Veuillez d'abord déterminer votre position");
      return;
    }
    
    // URL Google Maps pour les directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${carrossier.latitude},${carrossier.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Fonction pour appeler un carrossier
  const callCarrossier = (telephone: string) => {
    window.location.href = `tel:${telephone.replace(/\s/g, '')}`;
  };

  // Filtrer les carrossiers selon la recherche
  const filteredCarrossiers = carrossiers.filter(
    carrossier => 
      carrossier.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carrossier.adresse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-constalib-light-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-constalib-dark mb-6 text-center">
            Trouver un carrossier partenaire
          </h1>
          <p className="text-constalib-dark-gray text-center mb-8 max-w-3xl mx-auto">
            Localisez les carrossiers agréés proches de vous pour effectuer vos réparations suite à un accident.
            Vous bénéficiez d'un service préférentiel en tant qu'utilisateur Constalib.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Entrez une ville ou un code postal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  {loading ? "Recherche..." : "Rechercher"}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="whitespace-nowrap"
                >
                  {locationLoading ? "Localisation..." : "Ma position"}
                  <MapPin className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {userLocation && (
              <div className="mt-4 p-3 bg-constalib-light-blue/50 rounded-md text-sm text-constalib-blue">
                <p className="flex items-center">
                  <MapPin className="inline-block mr-2 h-4 w-4 text-constalib-blue" />
                  Position actuelle utilisée pour calculer les distances
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCarrossiers.length > 0 ? (
              filteredCarrossiers.map((carrossier) => (
                <Card key={carrossier.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{carrossier.nom}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1 inline-block text-constalib-dark-gray" />
                          {carrossier.adresse}
                        </CardDescription>
                      </div>
                      {carrossier.distance && (
                        <div className="bg-constalib-light-blue text-constalib-blue px-2 py-1 rounded-md text-sm font-medium">
                          {carrossier.distance} km
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-constalib-dark-gray" />
                      <span>{carrossier.telephone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-constalib-dark-gray" />
                      <span>{carrossier.horaires}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>{carrossier.note}/5</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => callCarrossier(carrossier.telephone)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => getDirections(carrossier)}
                      disabled={!userLocation}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Y aller
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center p-10">
                <p className="text-constalib-dark-gray">Aucun carrossier trouvé. Veuillez modifier votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default CarrossiersPage;
