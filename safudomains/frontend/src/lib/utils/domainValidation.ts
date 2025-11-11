/**
 * Domain Validation Utilities
 * Functions for validating domain names and related inputs
 */

/**
 * Check if a domain name is valid
 * @param name - Domain name to validate
 * @returns True if valid, false otherwise
 */
export const isValidDomainName = (name: string): boolean => {
  if (!name || name.length < 3) {
    return false;
  }

  // Check for invalid characters
  const validPattern = /^[a-z0-9-]+$/;
  if (!validPattern.test(name)) {
    return false;
  }

  // Cannot start or end with hyphen
  if (name.startsWith('-') || name.endsWith('-')) {
    return false;
  }

  return true;
};

/**
 * Get domain validation error message
 * @param name - Domain name to validate
 * @returns Error message or null if valid
 */
export const getDomainValidationError = (name: string): string | null => {
  if (!name || name.length === 0) {
    return 'Domain name is required';
  }

  if (name.length < 3) {
    return 'Domain name must be at least 3 characters';
  }

  const validPattern = /^[a-z0-9-]+$/;
  if (!validPattern.test(name)) {
    return 'Domain name can only contain lowercase letters, numbers, and hyphens';
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return 'Domain name cannot start or end with a hyphen';
  }

  return null;
};

/**
 * Normalize domain name (lowercase, trim)
 * @param name - Domain name to normalize
 * @returns Normalized domain name
 */
export const normalizeDomainName = (name: string): string => {
  return name.toLowerCase().trim();
};

/**
 * Get domain character tier for pricing
 * @param name - Domain name
 * @returns Character count tier (2-5+)
 */
export const getDomainCharacterTier = (name: string): number => {
  const length = name.length;
  if (length === 2) return 2;
  if (length === 3) return 3;
  if (length === 4) return 4;
  if (length === 5) return 5;
  return 5; // 5+ characters
};

/**
 * Check if Ethereum address is valid
 * @param address - Ethereum address to validate
 * @returns True if valid, false otherwise
 */
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
