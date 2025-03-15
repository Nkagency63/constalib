
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Phone, Ambulance, AlertCircle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyServicesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmergencyContacted: () => void;
  geolocation?: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

const EmergencyServicesDrawer = ({
  open,
  onOpenChange,
  onEmergencyContacted,
  geolocation
}: EmergencyServicesDrawerProps) => {
  const [calling, setCalling] = useState(false);
  const { toast } = useToast();

  const emergencyServices = [
    {
      id: 'police',
      name: 'Police',
      number: '17',
      icon: <ShieldAlert className="h-6 w-6 text-blue-600" />
    },
    {
      id: 'ambulance',
      name: 'SAMU',
      number: '15',
      icon: <Ambulance className="h-6 w-6 text-red-600" />
    },
    {
      id: 'firefighters',
      name: 'Pompiers',
      number: '18',
      icon: <AlertCircle className="h-6 w-6 text-orange-600" />
    },
    {
      id: 'emergency',
      name: 'Numéro d\'urgence européen',
      number: '112',
      icon: <Phone className="h-6 w-6 text-green-600" />
    }
  ];

  const handleCallEmergency = (serviceName: string, number: string) => {
    setCalling(true);
    
    // Simulate calling delay
    setTimeout(() => {
      setCalling(false);
      onEmergencyContacted();
      onOpenChange(false);
      
      toast({
        title: "Services d'urgence contactés",
        description: `Vous avez contacté ${serviceName} (${number})`,
      });
    }, 1000);
    
    // On mobile devices, this would actually initiate a phone call
    window.location.href = `tel:${number}`;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl text-red-600">Services d'urgence</DrawerTitle>
          <DrawerDescription>
            Contactez les services d'urgence appropriés pour votre situation
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-4">
          {geolocation && geolocation.address && (
            <div className="bg-slate-50 p-3 rounded-md text-sm">
              <p className="font-medium">Votre position actuelle:</p>
              <p className="text-slate-700">{geolocation.address}</p>
              {geolocation.lat && geolocation.lng && (
                <p className="text-xs text-slate-500 mt-1">
                  Coordonnées: {geolocation.lat.toFixed(6)}, {geolocation.lng.toFixed(6)}
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyServices.map((service) => (
              <Button
                key={service.id}
                variant="outline"
                className="h-auto flex items-center justify-start gap-3 p-4 border-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                onClick={() => handleCallEmergency(service.name, service.number)}
                disabled={calling}
              >
                <div className="bg-white rounded-full p-2 shadow-sm">
                  {service.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xl font-bold">{service.number}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        <DrawerFooter>
          <p className="text-sm text-center text-slate-500 mb-2">
            En cas d'urgence vitale, ne perdez pas de temps et appelez directement le 15 ou le 112
          </p>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EmergencyServicesDrawer;
