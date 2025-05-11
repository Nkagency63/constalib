
import { isValidLicensePlate } from '../../utils/licensePlateFormatters';
import { toast } from 'sonner';

/**
 * Validates a license plate before performing a lookup
 */
export const validateLicensePlate = (licensePlate: string, format: 'siv' | 'fni'): boolean => {
  if (!licensePlate || licensePlate.trim().length === 0) {
    toast.error("Veuillez saisir une immatriculation");
    return false;
  }
  
  if (!isValidLicensePlate(licensePlate, format)) {
    const formatName = format === 'siv' ? 'SIV (AB-123-CD)' : 'FNI (123 ABC 75)';
    toast.error(`Format d'immatriculation invalide pour le format ${formatName}`);
    return false;
  }
  
  return true;
};
