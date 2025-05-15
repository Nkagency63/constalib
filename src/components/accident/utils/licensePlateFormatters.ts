
/**
 * Utilities for formatting different types of license plates
 */

// Format SIV license plate (post-2009 format: AB-123-CD)
export const formatSivLicensePlate = (value: string): string => {
  // Remove any existing spaces or dashes
  const cleaned = value.replace(/[\s-]/g, '').toUpperCase();
  
  // Apply the AB-123-CD format for SIV (if the input has the right length)
  if (cleaned.length > 0) {
    let formatted = cleaned;
    
    // Add dashes if we have enough characters
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '-' + cleaned.substring(2);
    }
    
    if (cleaned.length > 5) {
      formatted = formatted.substring(0, 6) + '-' + formatted.substring(6);
    }
    
    // Limit to 9 characters (including dashes)
    return formatted.substring(0, 9);
  }
  
  return cleaned;
};

// Format FNI license plate (pre-2009 format: 123 ABC 75)
export const formatFniLicensePlate = (value: string): string => {
  // Remove any existing spaces
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  
  // Apply the 123 ABC 75 format for FNI
  if (cleaned.length > 0) {
    let formatted = cleaned;
    
    // Add spaces if we have enough characters (123 ABC 75)
    if (cleaned.length > 3) {
      formatted = cleaned.substring(0, 3) + ' ' + cleaned.substring(3);
    }
    
    if (cleaned.length > 6) {
      formatted = formatted.substring(0, 7) + ' ' + formatted.substring(7);
    }
    
    // Limit to 10 characters (including spaces)
    return formatted.substring(0, 10);
  }
  
  return cleaned;
};

// Format date to French locale
export const formatDateFr = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Validates a license plate format
 * @param plate License plate to validate
 * @param format Format type ('siv' for modern format, 'fni' for old format)
 * @returns boolean indicating if the license plate is valid
 */
export const isValidLicensePlate = (plate: string, format: 'siv' | 'fni'): boolean => {
  if (!plate || plate.length < 3) return false;
  
  // For SIV format (modern French plates, e.g. AA-123-BB)
  if (format === 'siv') {
    // Basic validation - SIV is typically 7-9 characters excluding hyphens
    const normalized = plate.replace(/[\s-]/g, '').toUpperCase();
    
    // Check if the normalized plate has at least 5 characters
    if (normalized.length < 5) return false;
    
    // Check if the plate follows the basic pattern: 2 letters + 3 digits + 2 letters
    // This regex allows partial plates as well (during typing)
    const sivPattern = /^[A-Z]{1,2}[0-9]{0,3}[A-Z]{0,2}$/;
    return sivPattern.test(normalized);
  }
  
  // For FNI format (old format, e.g. 123 ABC 75)
  if (format === 'fni') {
    // Basic validation - FNI is typically 6-8 characters excluding spaces
    const normalized = plate.replace(/\s/g, '').toUpperCase();
    
    // Check if the normalized plate has at least 4 characters
    if (normalized.length < 4) return false;
    
    // Check if the plate follows the basic pattern: 1-4 digits + 1-3 letters + optional 1-2 digits (dept)
    // This regex allows partial plates as well (during typing)
    const fniPattern = /^[0-9]{1,4}[A-Z]{1,3}([0-9]{0,2})?$/;
    return fniPattern.test(normalized);
  }
  
  return false;
};

// Helper function to check if a string matches a pattern
const matchesPattern = (str: string, pattern: RegExp): boolean => {
  return pattern.test(str);
};
