import { describe, it, expect } from 'vitest';
import {
  isValidDomainName,
  getDomainValidationError,
  normalizeDomainName,
  getDomainCharacterTier,
  isValidEthereumAddress,
} from '../domainValidation';

describe('domainValidation', () => {
  describe('isValidDomainName', () => {
    it('should return true for valid domain names', () => {
      expect(isValidDomainName('abc')).toBe(true);
      expect(isValidDomainName('test')).toBe(true);
      expect(isValidDomainName('my-domain')).toBe(true);
      expect(isValidDomainName('test123')).toBe(true);
      expect(isValidDomainName('123test')).toBe(true);
    });

    it('should return false for names shorter than 3 characters', () => {
      expect(isValidDomainName('')).toBe(false);
      expect(isValidDomainName('a')).toBe(false);
      expect(isValidDomainName('ab')).toBe(false);
    });

    it('should return false for names with invalid characters', () => {
      expect(isValidDomainName('test@domain')).toBe(false);
      expect(isValidDomainName('test.domain')).toBe(false);
      expect(isValidDomainName('test domain')).toBe(false);
      expect(isValidDomainName('TEST')).toBe(false); // uppercase not allowed
      expect(isValidDomainName('test_domain')).toBe(false);
    });

    it('should return false for names starting or ending with hyphen', () => {
      expect(isValidDomainName('-test')).toBe(false);
      expect(isValidDomainName('test-')).toBe(false);
      expect(isValidDomainName('-test-')).toBe(false);
    });
  });

  describe('getDomainValidationError', () => {
    it('should return error for empty name', () => {
      expect(getDomainValidationError('')).toBe('Domain name is required');
    });

    it('should return error for short names', () => {
      expect(getDomainValidationError('ab')).toBe(
        'Domain name must be at least 3 characters'
      );
    });

    it('should return error for invalid characters', () => {
      const error = getDomainValidationError('test@domain');
      expect(error).toContain('lowercase letters, numbers, and hyphens');
    });

    it('should return error for names starting with hyphen', () => {
      const error = getDomainValidationError('-test');
      expect(error).toContain('cannot start or end with a hyphen');
    });

    it('should return null for valid names', () => {
      expect(getDomainValidationError('validname')).toBe(null);
      expect(getDomainValidationError('valid-name')).toBe(null);
      expect(getDomainValidationError('test123')).toBe(null);
    });
  });

  describe('normalizeDomainName', () => {
    it('should convert to lowercase', () => {
      expect(normalizeDomainName('TEST')).toBe('test');
      expect(normalizeDomainName('TeSt')).toBe('test');
    });

    it('should trim whitespace', () => {
      expect(normalizeDomainName('  test  ')).toBe('test');
      expect(normalizeDomainName('test ')).toBe('test');
      expect(normalizeDomainName(' test')).toBe('test');
    });

    it('should handle both lowercase and trim', () => {
      expect(normalizeDomainName('  TEST  ')).toBe('test');
    });
  });

  describe('getDomainCharacterTier', () => {
    it('should return correct tier for 2 characters', () => {
      expect(getDomainCharacterTier('ab')).toBe(2);
    });

    it('should return correct tier for 3 characters', () => {
      expect(getDomainCharacterTier('abc')).toBe(3);
    });

    it('should return correct tier for 4 characters', () => {
      expect(getDomainCharacterTier('abcd')).toBe(4);
    });

    it('should return correct tier for 5 characters', () => {
      expect(getDomainCharacterTier('abcde')).toBe(5);
    });

    it('should return 5 for 5+ characters', () => {
      expect(getDomainCharacterTier('abcdef')).toBe(5);
      expect(getDomainCharacterTier('abcdefghij')).toBe(5);
    });
  });

  describe('isValidEthereumAddress', () => {
    it('should return true for valid Ethereum addresses', () => {
      expect(
        isValidEthereumAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
      ).toBe(true);
      expect(
        isValidEthereumAddress('0x0000000000000000000000000000000000000000')
      ).toBe(true);
      expect(
        isValidEthereumAddress('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
      ).toBe(true);
    });

    it('should return false for invalid addresses', () => {
      expect(isValidEthereumAddress('0x123')).toBe(false);
      expect(isValidEthereumAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(
        false
      ); // missing 0x
      expect(
        isValidEthereumAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbX')
      ).toBe(false); // invalid character
      expect(isValidEthereumAddress('')).toBe(false);
      expect(isValidEthereumAddress('0x')).toBe(false);
    });
  });
});
