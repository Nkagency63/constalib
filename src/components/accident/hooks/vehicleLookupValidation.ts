
/**
 * Validation utility for license plates
 */
export const isValidLicensePlate = (plate: string, format: 'siv' | 'fni'): boolean => {
  if (!plate || plate.length < 5) return false;
  
  // For SIV format (modern French plates, e.g. AA-123-BB)
  if (format === 'siv') {
    // Basic validation - SIV is typically 7-9 characters excluding hyphens
    const normalized = plate.replace(/[\s-]/g, '').toUpperCase();
    return normalized.length >= 5;
  }
  
  // For FNI format (old format, e.g. 123 ABC 75)
  if (format === 'fni') {
    // Basic validation - FNI is typically 6-8 characters excluding spaces
    const normalized = plate.replace(/\s/g, '').toUpperCase();
    return normalized.length >= 5;
  }
  
  return true;
};
