/**
 * Shared type definitions for domain registration and management
 */

/**
 * Parameters required for domain registration
 */
export type RegisterParams = {
  domain: string;
  duration: number;
  resolver: `0x${string}`;
  data: `0x${string}`[];
  reverseRecord: boolean;
  ownerControlledFuses: number;
  lifetime: boolean;
  referree: string;
};

/**
 * Payment method options for domain registration
 */
export type PaymentMethod = 'BNB' | 'CAKE' | 'USD1';

/**
 * Payment token configuration
 */
export type PaymentToken = {
  symbol: PaymentMethod;
  address: `0x${string}`;
  decimals: number;
  name: string;
};

/**
 * Price information for domain registration
 */
export type DomainPrice = {
  base: bigint;
  premium: bigint;
  total: bigint;
};

/**
 * Domain registration status
 */
export type RegistrationStatus =
  | 'idle'
  | 'approving'
  | 'registering'
  | 'success'
  | 'error';

/**
 * Text record key-value pair
 */
export type TextRecord = {
  key: string;
  value: string;
};

/**
 * Social media platform identifiers
 */
export type SocialPlatform =
  | 'com.twitter'
  | 'com.github'
  | 'com.reddit'
  | 'org.telegram'
  | 'com.youtube'
  | 'email'
  | 'url'
  | 'avatar'
  | 'description';

/**
 * Domain information
 */
export type DomainInfo = {
  name: string;
  owner: `0x${string}`;
  resolver: `0x${string}`;
  expiryDate: Date | null;
  isWrapped: boolean;
  available: boolean;
};
