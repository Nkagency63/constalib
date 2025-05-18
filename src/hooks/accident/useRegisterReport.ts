import { useState } from 'react';
import { FormData, GeolocationData } from '@/components/accident/types';
import { toast } from 'sonner';

export const useRegisterReport = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const registerReport = async (formData: FormData) => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      console.log('Registering accident report with data:', formData);
      
      // Validate required fields
      if (!formData.date || !formData.time || !formData.geolocation) {
        throw new Error('Informations de base manquantes');
      }

      // Format data for API submission
      const apiFormData = {
        // Basic information
        date: formData.date,
        time: formData.time,
        location: formData.location || '',
        description: formData.description || '',
        
        // Geolocation data
        geolocation: {
          lat: formData.geolocation.lat,
          lng: formData.geolocation.lng,
          address: formData.geolocation.address,
          accuracy: formData.geolocation.accuracy || null,
          timestamp: formData.geolocation.timestamp || Date.now()
        },
        
        // Vehicle information
        vehicles: {
          A: {
            brand: formData.vehicleBrand || '',
            model: formData.vehicleModel || '',
            year: formData.vehicleYear || '',
            licensePlate: formData.licensePlate || '',
            insuranceCompany: formData.insuranceCompany || '',
            insurancePolicy: formData.insurancePolicy || '',
          },
          B: {
            brand: formData.otherVehicle?.brand || '',
            model: formData.otherVehicle?.model || '',
            year: formData.otherVehicle?.year || '',
            licensePlate: formData.otherVehicle?.licensePlate || '',
            insuranceCompany: formData.otherVehicle?.insuranceCompany || '',
            insurancePolicy: formData.otherVehicle?.insurancePolicy || '',
          }
        },
        
        // Driver information
        drivers: {
          A: {
            name: formData.driverName || '',
            address: formData.driverAddress || '',
            phone: formData.driverPhone || '',
            licenseNumber: formData.driverLicense || '',
          },
          B: {
            name: formData.otherDriverName || '',
            address: formData.otherDriverAddress || '',
            phone: formData.otherDriverPhone || '',
            licenseNumber: formData.otherDriverLicense || '',
          }
        },
        
        // Insured information
        insured: {
          A: {
            name: formData.insuredName || '',
            address: formData.insuredAddress || '',
            phone: formData.insuredPhone || '',
            email: formData.personalEmail || '',
          },
          B: {
            name: formData.otherInsuredName || '',
            address: formData.otherInsuredAddress || '',
            phone: formData.otherInsuredPhone || '',
            email: formData.otherInsuredEmail || '',
          }
        },
        
        // Circumstances
        circumstances: {
          vehicleA: formData.vehicleACircumstances?.filter(c => c.selected).map(c => c.id) || [],
          vehicleB: formData.vehicleBCircumstances?.filter(c => c.selected).map(c => c.id) || [],
        },
        
        // Injuries
        injuries: {
          hasInjuries: formData.hasInjuries || false,
          description: formData.injuriesDescription || '',
          details: formData.injuries || [],
        },
        
        // Material damage
        materialDamage: {
          hasDamage: formData.hasMaterialDamage || false,
          description: formData.materialDamageDescription || '',
        },
        
        // Witnesses
        witnesses: {
          hasWitnesses: formData.hasWitnesses || false,
          list: formData.witnesses || [],
        },
        
        // Scheme data
        schemeData: formData.schemeData || null,
        
        // Photo references
        photos: {
          vehiclePhotos: formData.vehiclePhotos?.map(p => typeof p === 'string' ? p : p.name) || [],
          damagePhotos: formData.damagePhotos?.map(p => typeof p === 'string' ? p : p.name) || [],
        }
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally submit to an API
      console.log('Data formatted for API submission:', apiFormData);
      
      // Mock successful submission
      setRegistrationSuccess(true);
      toast.success('Constat enregistré avec succès !');
      
      return true;
    } catch (error) {
      console.error('Error registering accident report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement du constat';
      setRegistrationError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerReport,
    isRegistering,
    registrationError,
    registrationSuccess
  };
};
