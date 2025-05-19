
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import FreeGeoLocation from './FreeGeoLocation';
import { GeolocationData } from './types';
import LocationDisplay from './LocationDisplay';

export interface BasicInfoStepProps {
  date: string;
  time: string;
  location: string;
  hasMaterialDamage?: boolean;
  materialDamageDescription?: string;
  geolocation?: GeolocationData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmergencyContacted: () => void;
  setGeolocation: (data: GeolocationData) => void;
  clearGeolocation?: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  date,
  time,
  location,
  hasMaterialDamage,
  materialDamageDescription,
  geolocation,
  handleInputChange,
  onEmergencyContacted,
  setGeolocation,
  clearGeolocation
}) => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);

  const handleGeolocationSuccess = (data: GeolocationData) => {
    setGeolocation(data);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date de l'accident</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            max={today}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Heure de l'accident</Label>
          <Input
            type="time"
            id="time"
            name="time"
            value={time}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lieu de l'accident</Label>
        <div className="flex space-x-2">
          <Input
            type="text"
            id="location"
            name="location"
            placeholder="Adresse, ville, code postal..."
            value={location}
            onChange={handleInputChange}
            required
            className="flex-1"
          />
        </div>
        <p className="text-sm text-constalib-dark-gray">
          Précisez l'adresse exacte ou une description du lieu (ex: intersection, autoroute, etc.)
        </p>
      </div>

      <FreeGeoLocation 
        setGeolocation={handleGeolocationSuccess}
        address={location} 
      />
      
      {geolocation && geolocation.lat && geolocation.lng && (
        <LocationDisplay 
          geolocation={geolocation} 
          setMapVisible={() => {}} 
        />
      )}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasMaterialDamage" 
            name="hasMaterialDamage"
            checked={hasMaterialDamage}
            onCheckedChange={(checked) => {
              const event = {
                target: {
                  name: "hasMaterialDamage",
                  value: checked ? "true" : "false",
                  type: "checkbox"
                }
              } as React.ChangeEvent<HTMLInputElement>;
              handleInputChange(event);
            }}
          />
          <Label htmlFor="hasMaterialDamage" className="font-medium">
            Dégâts matériels autres que les véhicules
          </Label>
        </div>
        
        {hasMaterialDamage && (
          <div className="mt-2">
            <Label htmlFor="materialDamageDescription">Description des dégâts</Label>
            <Textarea
              id="materialDamageDescription"
              name="materialDamageDescription"
              placeholder="Décrivez les dégâts matériels (mobilier urbain, clôture, etc.)"
              value={materialDamageDescription || ''}
              onChange={handleInputChange as any}
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Urgence médicale ?</h3>
            <p className="text-sm text-red-700 mt-1">
              Si l'accident a causé des blessures, contactez immédiatement les services d'urgence.
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                onEmergencyContacted();
              }}
            >
              J'ai contacté les secours
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
