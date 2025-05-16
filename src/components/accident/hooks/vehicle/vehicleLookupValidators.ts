
/**
 * Validates if a license plate meets the minimum requirements for lookup
 */
export const validateLicensePlate = (licensePlate: string, format: 'siv' | 'fni'): boolean => {
  if (!licensePlate || licensePlate.trim() === '') {
    return false;
  }
  
  const cleanedPlate = licensePlate.replace(/-/g, '').replace(/\s/g, '').trim();
  
  if (format === 'siv') {
    // SIV format: minimum 7 chars (AB123CD)
    return cleanedPlate.length >= 7;
  } else {
    // FNI format: minimum 5 chars (123AB75, doesn't include department number)
    return cleanedPlate.length >= 5;
  }
};
