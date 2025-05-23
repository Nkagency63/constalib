
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
