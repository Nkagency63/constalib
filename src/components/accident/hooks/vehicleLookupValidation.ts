
/**
 * Validation utility for license plates
 */
export const isValidLicensePlate = (plate: string, format: 'siv' | 'fni'): boolean => {
  if (!plate || plate.length < 5) return false;
  return true;
};
