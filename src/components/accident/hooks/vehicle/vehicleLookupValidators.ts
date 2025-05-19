
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
    if (cleanedPlate.length < 7) {
      return false;
    }
    
    // SIV pattern: 2 letters + 3 digits + 2 letters
    const sivPattern = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
    return sivPattern.test(cleanedPlate);
  } else {
    // FNI format: minimum 5 chars (123AB75, doesn't include department number)
    if (cleanedPlate.length < 5) {
      return false;
    }
    
    // FNI pattern: 1-4 digits + 1-3 letters + optional 1-2 digits (dept)
    const fniPattern = /^[0-9]{1,4}[A-Z]{1,3}([0-9]{0,2})?$/;
    return fniPattern.test(cleanedPlate);
  }
};
