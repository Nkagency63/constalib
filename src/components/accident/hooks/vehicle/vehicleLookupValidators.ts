
import { isValidLicensePlate } from '../../utils/licensePlateFormatters';
import { toast } from 'sonner';

/**
 * Validates a license plate before performing a lookup
 */
export const validateLicensePlate = (licensePlate: string, format: 'siv' | 'fni'): boolean => {
  if (!isValidLicensePlate(licensePlate, format)) {
    toast.error("Veuillez saisir une immatriculation valide");
    return false;
  }
  return true;
};
